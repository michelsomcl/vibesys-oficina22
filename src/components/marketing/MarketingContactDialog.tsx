
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateMarketing, useUpdateMarketing } from "@/hooks/useMarketing"
import { ImageUpload } from "./ImageUpload"
import { Tables } from "@/integrations/supabase/types"

interface MarketingContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Tables<"marketing">
}

export const MarketingContactDialog = ({
  open,
  onOpenChange,
  contact
}: MarketingContactDialogProps) => {
  const [formData, setFormData] = useState({
    nome_cliente: contact?.nome_cliente || "",
    telefone: contact?.telefone || "",
    data_aniversario: contact?.data_aniversario || "",
    imagem_url: contact?.imagem_url || ""
  })

  const createMarketing = useCreateMarketing()
  const updateMarketing = useUpdateMarketing()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome_cliente) {
      return
    }

    try {
      if (contact) {
        // Editar contato existente
        await updateMarketing.mutateAsync({
          id: contact.id,
          ...formData
        })
      } else {
        // Criar novo contato
        await createMarketing.mutateAsync(formData)
      }
      
      onOpenChange(false)
      setFormData({
        nome_cliente: "",
        telefone: "",
        data_aniversario: "",
        imagem_url: ""
      })
    } catch (error) {
      console.error("Erro ao salvar contato:", error)
    }
  }

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imagem_url: imageUrl }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {contact ? "Editar Contato" : "Novo Contato de Marketing"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Cliente *</Label>
              <Input 
                id="nome" 
                value={formData.nome_cliente}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_cliente: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone" 
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="aniversario">Data de Aniversário</Label>
            <Input 
              id="aniversario" 
              type="date"
              value={formData.data_aniversario}
              onChange={(e) => setFormData(prev => ({ ...prev, data_aniversario: e.target.value }))}
            />
          </div>

          <ImageUpload 
            onImageUploaded={handleImageUploaded}
            currentImageUrl={formData.imagem_url}
          />
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMarketing.isPending || updateMarketing.isPending}
            >
              {createMarketing.isPending || updateMarketing.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
