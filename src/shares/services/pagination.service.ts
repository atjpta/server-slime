import { Model, PopulateOptions, type QueryFilter } from "mongoose";
import { PaginationQuery } from "@/shares/validators/pagination.validator.js";

export async function paginateQueryBuilder<T>(
    model: Model<T>,
    filter: QueryFilter<T>,
    pagination: PaginationQuery,
    select?: (keyof T & string)[],
    populate?: PopulateOptions[]
) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        model
            .find(filter)
            .select(select || [])
            .populate(populate || [])
            .skip(skip)
            .limit(limit)
            .lean() as Promise<Partial<T>[]>,
        model.countDocuments(filter),
    ]);

    return { items, pagination: { total, page, limit } };
}
