import { DataProvider, HttpError } from "@refinedev/core";
import { supabaseClient } from "./supabase-client";

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
        throw new HttpError(error.message, error.code, {
          errorData: error,
          resource,
          action: "getList",
        });
      }

      return {
        data: data ?? [],
        total: count ?? 0,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError("An error occurred while fetching data", 500, {
        resource,
        action: "getList",
      });
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
        throw new HttpError(error.message, error.code, {
          errorData: error,
          resource,
          action: "getOne",
          id,
        });
      }

      return {
        data,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError("An error occurred while fetching data", 500, {
        resource,
        action: "getOne",
        id,
      });
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
        throw new HttpError(error.message, error.code, {
          errorData: error,
          resource,
          action: "create",
        });
      }

      return {
        data,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError("An error occurred while creating data", 500, {
        resource,
        action: "create",
      });
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
        throw new HttpError(error.message, error.code, {
          errorData: error,
          resource,
          action: "update",
          id,
        });
      }

      return {
        data,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError("An error occurred while updating data", 500, {
        resource,
        action: "update",
        id,
      });
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
        throw new HttpError(error.message, error.code, {
          errorData: error,
          resource,
          action: "deleteOne",
          id,
        });
      }

      return {
        data: data ?? { id },
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError("An error occurred while deleting data", 500, {
        resource,
        action: "deleteOne",
        id,
      });
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
          throw new HttpError(error.message, error.code, {
            errorData: error,
            resource: url,
            action: "custom",
          });
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
        throw new HttpError(
          response?.error?.message || "Unknown error in custom method",
          response?.error?.code || 500,
          {
            errorData: response?.error,
            resource: url,
            action: "custom",
          }
        );
      }

      return {
        data: response.data,
      } as unknown as import("@refinedev/core").CustomResponse<unknown>;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(
        "An error occurred while executing custom action",
        500,
        {
          resource: url,
          action: "custom",
        }
      );
    }
  },
};
