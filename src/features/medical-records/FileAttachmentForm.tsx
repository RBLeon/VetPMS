import React from "react";
import { Button } from "@/features/ui/components/button";
import { Input } from "@/features/ui/components/input";
import { Label } from "@/features/ui/components/label";
import { Attachment } from "@/lib/api/types";
import { X } from "lucide-react";

interface FileAttachmentFormProps {
  attachments: Attachment[];
  onAdd: (attachment: Attachment) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

export const FileAttachmentForm: React.FC<FileAttachmentFormProps> = ({
  attachments,
  onAdd,
  onRemove,
  isSubmitting,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAttachment: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedBy: "1", // TODO: Get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAdd(newAttachment);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Bestand Uploaden</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          disabled={isSubmitting}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          aria-label="upload"
        />
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <Label>Geüploade Bestanden</Label>
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{attachment.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
