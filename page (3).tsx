import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { isResourceKey } from "@/lib/admin-config";

export default function AdminResourcePage({ params }: { params: { resource: string } }) {
  if (!isResourceKey(params.resource)) notFound();
  return <ResourceManager resourceKey={params.resource} />;
}
