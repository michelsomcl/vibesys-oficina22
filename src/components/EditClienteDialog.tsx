
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateCliente } from "@/hooks/useClientes"
import { Tables } from "@/integrations/supabase/types"

interface EditClienteDialogProps {
  cliente: Tables<"clientes">
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Função para converter data dd/mm/aaaa para YYYY-MM-DD
const formatDateForDatabase = (dateStr: string): string => {
  if (!dateStr) return ""
  
  // Se já está no formato YYYY-MM-DD, retorna como está
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr
  }
  
  // Se está no formato dd/mm/aaaa
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month}-${day}`
  }
  
  return ""
}

// Função para converter data YYYY-MM-DD para dd/mm/aaaa
const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return ""
  
  // Se está no formato YYYY-MM-DD
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const [, year, month, day] = match
    return `${day}/${month}/${year}`
  }
  
  return dateStr
}

export const EditClienteDialog = ({ cliente, open, onOpenChange }: EditClienteDialogProps) => {
  const [formData, setFormData] = useState({
    tipo: cliente.tipo,
    nome: cliente.nome,
    documento: cliente.documento,
    telefone: cliente.telefone || "",
    endereco: cliente.endereco || "",
    aniversario: formatDateForDisplay(cliente.aniversario || ""),
  })

  const updateCliente = useUpdateCliente()

  // Reset form data when cliente changes
  useEffect(() => {
    setFormData({
      tipo: cliente.tipo,
      nome: cliente.nome,
      documento: cliente.documento,
      telefone: cliente.telefone || "",
      endereco: cliente.endereco || "",
      aniversario: formatDateForDisplay(cliente.aniversario || ""),
    })
  }, [cliente])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.documento) {
      return
    }

    // Converter a data para o formato do banco antes de enviar
    const dataToSubmit = {
      ...formData,
      aniversario: formatDateForDatabase(formData.aniversario)
    }

    updateCliente.mutate(
      { id: cliente.id, ...dataToSubmit },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome" 
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documento">Documento</Label>
              <Input 
                id="documento" 
                value={formData.documento}
                onChange={(e) => setFormData(prev => ({ ...prev, documento: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone" 
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input 
                id="endereco" 
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="aniversario">Aniversário</Label>
              <Input 
                id="aniversario" 
                placeholder="dd/mm/aaaa"
                value={formData.aniversario}
                onChange={(e) => setFormData(prev => ({ ...prev, aniversario: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={updateCliente.isPending}
            >
              {updateCliente.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
