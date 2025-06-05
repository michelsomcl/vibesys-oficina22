import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFornecedores } from "@/hooks/useFornecedores"
import { usePecas } from "@/hooks/usePecas"
import { useCreateCompraPeca } from "@/hooks/useComprasPecas"
import { toast } from "sonner"

interface CompraPecaFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const CompraPecaForm = ({ onSuccess, onCancel }: CompraPecaFormProps) => {
  const [formData, setFormData] = useState({
    numero_nota: "",
    fornecedor_id: "",
    peca_id: "",
    quantidade: 1,
    valor_custo: 0,
  })

  const { data: fornecedores = [] } = useFornecedores()
  const { data: pecas = [] } = usePecas()
  const createCompraPeca = useCreateCompraPeca()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.numero_nota || !formData.fornecedor_id || !formData.peca_id || !formData.valor_custo) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    createCompraPeca.mutate(formData, {
      onSuccess: () => {
        setFormData({
          numero_nota: "",
          fornecedor_id: "",
          peca_id: "",
          quantidade: 1,
          valor_custo: 0,
        })
        onSuccess?.()
      }
    })
  }

  const handleCancel = () => {
    setFormData({
      numero_nota: "",
      fornecedor_id: "",
      peca_id: "",
      quantidade: 1,
      valor_custo: 0,
    })
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="numero_nota">Número da Nota Fiscal</Label>
        <Input 
          id="numero_nota" 
          placeholder="Digite o número da nota fiscal" 
          value={formData.numero_nota}
          onChange={(e) => setFormData(prev => ({ ...prev, numero_nota: e.target.value }))} 
          required
        />
      </div>

      <div>
        <Label htmlFor="fornecedor_id">Fornecedor</Label>
        <Select 
          value={formData.fornecedor_id} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, fornecedor_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um fornecedor" />
          </SelectTrigger>
          <SelectContent>
            {fornecedores.map((fornecedor) => (
              <SelectItem key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="peca_id">Peça</Label>
        <Select 
          value={formData.peca_id} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, peca_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma peça" />
          </SelectTrigger>
          <SelectContent>
            {pecas.map((peca) => (
              <SelectItem key={peca.id} value={peca.id}>
                {peca.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input 
            id="quantidade" 
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={(e) => setFormData(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))} 
            required
          />
        </div>

        <div>
          <Label htmlFor="valor_custo">Valor de Custo (R$)</Label>
          <Input 
            id="valor_custo" 
            type="number"
            step="0.01"
            min="0"
            value={formData.valor_custo || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, valor_custo: parseFloat(e.target.value) || 0 }))} 
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={createCompraPeca.isPending}
        >
          {createCompraPeca.isPending ? "Registrando..." : "Registrar Compra"}
        </Button>
      </div>
    </form>
  )
}

export default CompraPecaForm
