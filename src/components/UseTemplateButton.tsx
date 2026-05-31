import { useNavigate } from "@tanstack/react-router";
import { useResumeStore } from "@/store/resume-store";
import type { TemplateId } from "@/lib/resume-types";

interface Props {
  templateId: TemplateId;
  className?: string;
  children?: React.ReactNode;
}

export function UseTemplateButton({ templateId, className, children = "Use this" }: Props) {
  const { createResume, updateResume } = useResumeStore();
  const navigate = useNavigate();

  function handleUse() {
    const id = createResume();
    updateResume(id, (r) => ({
      ...r,
      customization: { ...r.customization, template: templateId },
    }));
    navigate({ to: "/builder/$id", params: { id } });
  }

  return (
    <button type="button" onClick={handleUse} className={className}>
      {children}
    </button>
  );
}
