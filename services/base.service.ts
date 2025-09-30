import { createClient } from "@/lib/supabase/server";
import { FilterOption, SortOption } from "@/types/pagination";
import { SearchParams } from "@/types/pagination";

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}


export { NotFoundError, ValidationError };