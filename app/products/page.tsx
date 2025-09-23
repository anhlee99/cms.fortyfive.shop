export default function ProductsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product Management</h1>
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Catalog</h2>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Add New Product
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="bg-gray-200 h-32 rounded mb-4"></div>
                <h3 className="font-semibold">Sample Product 1</h3>
                <p className="text-gray-600 text-sm">SKU: SP001</p>
                <p className="text-lg font-bold">$29.99</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="bg-gray-200 h-32 rounded mb-4"></div>
                <h3 className="font-semibold">Sample Product 2</h3>
                <p className="text-gray-600 text-sm">SKU: SP002</p>
                <p className="text-lg font-bold">$39.99</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="bg-gray-200 h-32 rounded mb-4"></div>
                <h3 className="font-semibold">Sample Product 3</h3>
                <p className="text-gray-600 text-sm">SKU: SP003</p>
                <p className="text-lg font-bold">$49.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}