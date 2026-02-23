import { useQuery } from "@tanstack/react-query";
import { api, buildUrl, type ModuleListResponse, type ModuleWithQuestionsResponse } from "@shared/routes";

export function useModules() {
  return useQuery({
    queryKey: [api.modules.list.path],
    queryFn: async () => {
      const res = await fetch(api.modules.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch modules");
      const data = await res.json();
      return api.modules.list.responses[200].parse(data);
    },
  });
}

export function useModule(slug: string) {
  return useQuery({
    queryKey: [api.modules.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.modules.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch module");
      
      const data = await res.json();
      return api.modules.get.responses[200].parse(data);
    },
    enabled: !!slug,
  });
}
