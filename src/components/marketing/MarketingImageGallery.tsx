
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploadDialog } from "./ImageUploadDialog"
import { Upload, Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"

export function MarketingImageGallery() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

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
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openImage(imageUrl)}
                  >
                    <ExternalLink className="h-3 w-3" />
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
