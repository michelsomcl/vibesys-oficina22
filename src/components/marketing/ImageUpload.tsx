
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  currentImageUrl?: string
}

export const ImageUpload = ({ onImageUploaded, currentImageUrl }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione apenas arquivos de imagem")
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    try {
      setUploading(true)

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('marketing-images')
        .upload(fileName, file)

      if (error) {
        throw error
      }

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('marketing-images')
        .getPublicUrl(data.path)

      setImageUrl(publicUrl)
      onImageUploaded(publicUrl)
      toast.success("Imagem enviada com sucesso!")

    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      toast.error("Erro ao enviar imagem")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    onImageUploaded("")
  }

  return (
    <div className="space-y-4">
      <Label>Imagem</Label>
      
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="w-full max-w-md h-48 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button 
                variant="outline" 
                disabled={uploading}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Enviando..." : "Selecionar Imagem"}
                </span>
              </Button>
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF até 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
