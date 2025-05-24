import { DataProvider, BaseKey } from "@refinedev/core";
import { supabaseClient } from "./supabase-client";

// Create a custom error handler since HttpError might not be available
const handleError = (
  error: any,
  resource?: string,
  action?: string,
  id?: BaseKey
) => {
  // Create a standardized error object
  const customError = {
    message: error?.message || "An error occurred",
    statusCode: error?.code || 500,
    data: {
      resource,
      action,
      id: id?.toString(),
      errorData: error,
    },
  };

  console.error("Data provider error:", customError);

  // Throw a regular Error with the message
  throw new Error(customError.message);
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const { current = 1, pageSize = 10 } = pagination ?? {};
    const from = (current - 1) * pageSize;
    const to = from + pageSize - 1;
    const tenantId = meta?.tenant_id;

    try {
      let query = supabaseClient
        .from(resource)
        .select("*", { count: "exact" })
        .eq("tenant_id", tenantId);

      filters?.forEach((filter) => {
        if (filter.operator === "eq") {
          query = query.eq(filter.field, filter.value);
        } else if (filter.operator === "gt") {
          query = query.gt(filter.field, filter.value);
        } else if (filter.operator === "gte") {
          query = query.gte(filter.field, filter.value);
        } else if (filter.operator === "lt") {
          query = query.lt(filter.field, filter.value);
        } else if (filter.operator === "lte") {
          query = query.lte(filter.field, filter.value);
        } else if (filter.operator === "contains") {
          query = query.ilike(filter.field, `%${filter.value}%`);
        }
      });

      sorters?.forEach((sorter) => {
        query = query.order(sorter.field, {
          ascending: sorter.order === "asc",
        });
      });

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        handleError(error, resource, "getList");
      }

      return {
        data: data ?? [],
        total: count ?? 0,
      };
    } catch (error) {
      handleError(error, resource, "getList");
      // This return is needed for TypeScript but won't be reached
      return { data: [], total: 0 };
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const tenantId = meta?.tenant_id;

    try {
      const { data, error } = await supabaseClient
        .from(resource)
        .select("*")
        .eq("id", id)
        .eq("tenant_id", tenantId)
        .single();

      if (error) {
        handleError(error, resource, "getOne", id);
      }

      return {
        data,
      };
    } catch (error) {
      handleError(error, resource, "getOne", id);
      // This return is needed for TypeScript but won't be reached
      return { data: {} as any };
    }
  },

  create: async ({ resource, variables, meta }) => {
    const tenantId = meta?.tenant_id;

    try {
      const { data, error } = await supabaseClient
        .from(resource)
        .insert({ ...variables, tenant_id: tenantId })
        .select()
        .single();

      if (error) {
        handleError(error, resource, "create");
      }

      return {
        data,
      };
    } catch (error) {
      handleError(error, resource, "create");
      // This return is needed for TypeScript but won't be reached
      return { data: {} as any };
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const tenantId = meta?.tenant_id;

    try {
      const { data, error } = await supabaseClient
        .from(resource)
        .update(variables)
        .eq("id", id)
        .eq("tenant_id", tenantId)
        .select()
        .single();

      if (error) {
        handleError(error, resource, "update", id);
      }

      return {
        data,
      };
    } catch (error) {
      handleError(error, resource, "update", id);
      // This return is needed for TypeScript but won't be reached
      return { data: {} as any };
    }
  },

  deleteOne: async ({ resource, id, meta }) => {
    const tenantId = meta?.tenant_id;

    try {
      const { data, error } = await supabaseClient
        .from(resource)
        .delete()
        .eq("id", id)
        .eq("tenant_id", tenantId)
        .select()
        .single();

      if (error) {
        handleError(error, resource, "deleteOne", id);
      }

      return {
        data: data ?? { id },
      };
    } catch (error) {
      handleError(error, resource, "deleteOne", id);
      // This return is needed for TypeScript but won't be reached
      return { data: { id } };
    }
  },

  getApiUrl: () => {
    return "";
  },

  // @ts-expect-error: Suppress generic type error for MVP
  custom: async ({ url, method, filters, sorters, payload, query, meta }) => {
    const tenantId = meta?.tenant_id;

    try {
      const requestQuery = supabaseClient.from(url);

      if (method === "get") {
        let filterBuilder = requestQuery.select("*");
        filterBuilder = filterBuilder.eq("tenant_id", tenantId);

        filters?.forEach((filter) => {
          if (filter.operator === "eq") {
            filterBuilder = filterBuilder.eq(filter.field, filter.value);
          }
        });

        sorters?.forEach((sorter) => {
          filterBuilder = filterBuilder.order(sorter.field, {
            ascending: sorter.order === "asc",
          });
        });

        if (query) {
          Object.entries(query).forEach(([key, value]) => {
            filterBuilder = filterBuilder.eq(key, value);
          });
        }

        const { data, error } = await filterBuilder;

        if (error) {
          handleError(error, url, "custom");
        }

        return {
          data,
        } as unknown as import("@refinedev/core").CustomResponse<unknown>;
      }

      let response;
      if (method === "post") {
        response = await requestQuery
          .insert({ ...payload, tenant_id: tenantId })
          .select();
      } else if (method === "put") {
        response = await requestQuery.update(payload).select();
      } else if (method === "delete") {
        response = await requestQuery.delete();
      }

      if (!response || response.error) {
        handleError(
          response?.error || new Error("Unknown error in custom method"),
          url,
          "custom"
        );
      }

      return {
        data: response?.data || [],
      } as unknown as import("@refinedev/core").CustomResponse<unknown>;
    } catch (error) {
      handleError(error, url, "custom");
      // This return is needed for TypeScript but won't be reached
      return {
        data: {},
      } as unknown as import("@refinedev/core").CustomResponse<unknown>;
    }
  },
};
