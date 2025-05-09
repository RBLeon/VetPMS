import { useQuery } from "@tanstack/react-query";
import { mockApi, type StaffMember } from "../api/mockApi";

export const useStaff = () => {
  return useQuery<StaffMember[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockApi.staff;
    },
  });
};
