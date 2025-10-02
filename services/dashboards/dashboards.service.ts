import type { DashboardStats, DashboardStatsSearchParams} from "./dashboards.type";
import { createClient } from "@/lib/supabase/server";
 
export async function getStats(params?: DashboardStatsSearchParams): Promise<DashboardStats> {
  const supabase = await createClient();
  let q = supabase.from("orders").select("*, orders_products(*), customers:customer_id(*)", { count: "exact" })
    .is("deleted_at", null); // chỉ lấy những đơn hàng chưa bị xoá

  // lọc theo khoảng thời gian dựa trên timeView
  const now = new Date();
  let startDate: Date;
  switch (params?.timeView) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      const dayOfWeek = now.getDay(); // 0 (Chủ nhật) đến 6 (Thứ bảy)
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      break;
    }
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0); // nếu không có timeView, lấy tất cả
  }
  q = q.gte("created_at", startDate.toISOString());

  const { data, error, count } = await q;

  if (error) throw error;

  // Tính toán tổng doanh thu, tổng đơn hàng, tổng khách hàng và tổng sản phẩm
  const totalSales = data?.reduce((sum, order) => sum + (order.amount_payable || 0), 0) || 0;
  const totalOrders = count || 0;
  const uniqueCustomerIds = new Set(data?.map(order => order.customer_id));
  const totalCustomers = uniqueCustomerIds.size;
  const uniqueProductIds = new Set(
    data?.flatMap(order =>
      order.orders_products.map((item: { product_id: string }) => item.product_id)
    )
  );
  const totalProducts = Array.from(uniqueProductIds).reduce((sum, productId) => {
    const product = data?.flatMap(order => order.orders_products).find(item => item.product_id === productId);
    return sum + (product?.quantity || 0);
  }, 0);

  return {
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts
  };
}

// Top 5 sản phẩm bán chạy nhất trong khoảng thời gian
export async function getTopSaleProducts(timeView: string, limit: number, isNegative: boolean, labels: string[]): Promise<{ product_id: string; total_quantity: number; product_name: string | null; }[]> {
  const supabase = await createClient();
  let q = supabase.from("orders")
    .select(`
      orders_products(*), 
      orders_labels(label_id, labels(*)),
      products:orders_products(product_id)
    `, { count: "exact" })
    .is("deleted_at", null); // chỉ lấy những đơn hàng chưa bị xoá

  if (labels && labels.length > 0) {
    q = q.in("orders_labels.label_id", labels);
  }

  // lọc theo khoảng thời gian dựa trên timeView
  const now = new Date();
  let startDate: Date;
  switch (timeView) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      const dayOfWeek = now.getDay(); // 0 (Chủ nhật) đến 6 (Thứ bảy)
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      break;
    }
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0); // nếu không có timeView, lấy tất cả
  }
  q = q.gte("created_at", startDate.toISOString());

  const { data, error } = await q;

  if (error) throw error;

  // Tính toán tổng số lượng bán ra cho mỗi sản phẩm
  const productSalesMap: Record<string, { product_id: string; total_quantity: number; product: Record<string, any> | null; }> = {};
  data?.forEach(order => {
    order.orders_products.forEach((item: { product_id: string; quantity: number; products: { product: Record<string, any> | null; }[] }) => {
      if (!productSalesMap[item.product_id]) {
        productSalesMap[item.product_id] = {
          product_id: item.product_id,
          total_quantity: 0,
          product: item.products?.[0]?.product || null
        };
      }
      productSalesMap[item.product_id].total_quantity += item.quantity;
    });
  });

  // Chuyển đổi thành mảng và sắp xếp để lấy top 5
  if (isNegative) {
    // Lấy 5 sản phẩm bán chạy nhất
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, limit || 5)
      .map(item => ({
        product_id: item.product_id,
        total_quantity: item.total_quantity,
        product_name: item.product?.product_name ?? null
      }));
    return topProducts;
  }
  // Lấy 5 sản phẩm bán chậm nhất
  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => a.total_quantity - b.total_quantity)
    .slice(0, limit || 5)
    .map(item => ({
      product_id: item.product_id,
      total_quantity: item.total_quantity,
      product_name: item.product?.product_name ?? null
    }));
  return topProducts;
}

export async function getLabelSaleCircleData(timeView: string, labels: string[]): Promise<{ label_id: string; display_name: string; total_sales: number; }[]> {
  const supabase = await createClient();
  let q = supabase.from("orders")
    .select(`
      amount_payable, 
      orders_labels(label_id, labels(display_name))`, { count: "exact" })
    .is("deleted_at", null); // chỉ lấy những đơn hàng chưa bị xoá

  if (labels && labels.length > 0) {
    q = q.in("orders_labels.label_id", labels);
  }

  // lọc theo khoảng thời gian dựa trên timeView
  const now = new Date();
  let startDate: Date;
  switch (timeView) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      const dayOfWeek = now.getDay(); // 0 (Chủ nhật) đến 6 (Thứ bảy)
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      break;
    }
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0); // nếu không có timeView, lấy tất cả
  }
  q = q.gte("created_at", startDate.toISOString());

  const { data, error } = await q;

  if (error) throw error;

  // Tính toán tổng doanh thu cho mỗi nhãn
  const labelSalesMap: Record<string, { label_id: string; display_name: string; total_sales: number; }> = {};
  data?.forEach(order => {
    order.orders_labels.forEach((item: { label_id: string; labels: { display_name: string; }[] }) => {
      if (!labelSalesMap[item.label_id]) {
        labelSalesMap[item.label_id] = {
          label_id: item.label_id,
          display_name: item.labels?.[0]?.display_name || "Unknown",
          total_sales: 0
        };
      }
      labelSalesMap[item.label_id].total_sales += order.amount_payable || 0;
    });
  });

  return Object.values(labelSalesMap);
}