
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageUploaded: (imageUrl: string) => void
}

export function ImageUploadDialog({ open, onOpenChange, onImageUploaded }: ImageUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Verificar se é uma imagem
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Por favor, selecione apenas arquivos de imagem")
        return
      }

      // Verificar tamanho (máximo 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB")
        return
      }

      setFile(selectedFile)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Por favor, selecione uma imagem")
      return
    }

    setUploading(true)
    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `marketing/${fileName}`

      console.log("Uploading file:", fileName)

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('marketing-images')
        .upload(filePath, file)

      if (error) {
        console.error("Upload error:", error)
        throw error
      }

      console.log("Upload successful:", data)

      // Obter a URL pública da imagem
      const { data: publicData } = supabase.storage
        .from('marketing-images')
        .getPublicUrl(filePath)

      const imageUrl = publicData.publicUrl
      console.log("Public URL:", imageUrl)

      toast.success("Imagem enviada com sucesso!")
      onImageUploaded(imageUrl)
      onOpenChange(false)
      
      // Reset form
      setFile(null)
      setPreview(null)
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Erro ao enviar imagem")
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload de Imagem</DialogTitle>
          <DialogDescription>
            Selecione uma imagem para usar no marketing (máximo 5MB)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Selecionar Imagem</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>

          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Imagem
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
