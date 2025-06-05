
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploadDialog } from "./ImageUploadDialog"
import { Upload, Copy, ExternalLink, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

export function MarketingImageGallery() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar imagens do storage ao montar o componente
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('marketing-images')
        .list('marketing')

      if (error) {
        console.error("Erro ao carregar imagens:", error)
        return
      }

      if (data) {
        const imageUrls = data.map(file => {
          const { data: publicData } = supabase.storage
            .from('marketing-images')
            .getPublicUrl(`marketing/${file.name}`)
          return publicData.publicUrl
        })
        setUploadedImages(imageUrls)
      }
    } catch (error) {
      console.error("Erro ao carregar imagens:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImages(prev => [...prev, imageUrl])
    console.log("Image uploaded:", imageUrl)
  }

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL da imagem copiada!")
  }

  const openImage = (url: string) => {
    window.open(url, '_blank')
  }

  const deleteImage = async (imageUrl: string) => {
    try {
      // Extrair o nome do arquivo da URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `marketing/${fileName}`

      console.log("Deletando arquivo:", filePath)

      const { error } = await supabase.storage
        .from('marketing-images')
        .remove([filePath])

      if (error) {
        console.error("Erro ao deletar imagem:", error)
        toast.error("Erro ao deletar imagem")
        return
      }

      // Remover da lista local
      setUploadedImages(prev => prev.filter(url => url !== imageUrl))
      toast.success("Imagem deletada com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar imagem:", error)
      toast.error("Erro ao deletar imagem")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Galeria de Imagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="mx-auto h-12 w-12 mb-4 opacity-50 animate-pulse" />
            <p>Carregando imagens...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Galeria de Imagens</span>
          <Button onClick={() => setUploadDialogOpen(true)} size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload Imagem
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploadedImages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nenhuma imagem enviada ainda</p>
            <p className="text-sm">Clique em "Upload Imagem" para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Marketing image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyImageUrl(imageUrl)}
                    title="Copiar URL"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openImage(imageUrl)}
                    title="Abrir imagem"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteImage(imageUrl)}
                    title="Deletar imagem"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onImageUploaded={handleImageUploaded}
      />
    </Card>
  )
}
