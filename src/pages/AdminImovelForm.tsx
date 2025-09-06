import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getImovelById, type Imovel } from '@/mocks/imoveis';

const AdminImovelForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id !== 'novo';
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    tipo: 'casa' as 'casa' | 'apartamento' | 'terreno',
    status: 'disponivel' as 'disponivel' | 'vendido' | 'alugado',
    endereco: {
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    caracteristicas: {
      quartos: '',
      banheiros: '',
      garagem: '',
      area_m2: '',
      andar: ''
    },
    imagens: [{ url: '', alt: '' }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      const carregarImovel = async () => {
        setInitialLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const imovel = getImovelById(id);
          
          if (imovel) {
            setFormData({
              titulo: imovel.titulo,
              descricao: imovel.descricao,
              preco: imovel.preco.toString(),
              tipo: imovel.tipo,
              status: imovel.status,
              endereco: imovel.endereco,
              caracteristicas: {
                quartos: imovel.caracteristicas.quartos.toString(),
                banheiros: imovel.caracteristicas.banheiros.toString(),
                garagem: imovel.caracteristicas.garagem.toString(),
                area_m2: imovel.caracteristicas.area_m2.toString(),
                andar: imovel.caracteristicas.andar?.toString() || ''
              },
              imagens: imovel.imagens.length > 0 ? imovel.imagens : [{ url: '', alt: '' }]
            });
          }
        } catch (error) {
          toast({
            title: "Erro ao carregar imóvel",
            description: "Não foi possível carregar os dados do imóvel.",
            variant: "destructive"
          });
        } finally {
          setInitialLoading(false);
        }
      };
      
      carregarImovel();
    }
  }, [id, isEditing, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.preco.trim()) newErrors.preco = 'Preço é obrigatório';
    if (!formData.endereco.rua.trim()) newErrors['endereco.rua'] = 'Rua é obrigatória';
    if (!formData.endereco.bairro.trim()) newErrors['endereco.bairro'] = 'Bairro é obrigatório';
    if (!formData.endereco.cidade.trim()) newErrors['endereco.cidade'] = 'Cidade é obrigatória';
    if (!formData.endereco.estado.trim()) newErrors['endereco.estado'] = 'Estado é obrigatório';
    if (!formData.caracteristicas.area_m2.trim()) newErrors['caracteristicas.area_m2'] = 'Área é obrigatória';

    if (formData.tipo !== 'terreno') {
      if (!formData.caracteristicas.quartos.trim()) newErrors['caracteristicas.quartos'] = 'Quartos é obrigatório';
      if (!formData.caracteristicas.banheiros.trim()) newErrors['caracteristicas.banheiros'] = 'Banheiros é obrigatório';
    }

    // Validar pelo menos uma imagem com URL
    const imagensValidas = formData.imagens.filter(img => img.url.trim());
    if (imagensValidas.length === 0) {
      newErrors.imagens = 'Pelo menos uma imagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...formData.imagens];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData(prev => ({ ...prev, imagens: newImages }));
    
    if (errors.imagens) {
      setErrors(prev => ({ ...prev, imagens: '' }));
    }
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      imagens: [...prev.imagens, { url: '', alt: '' }]
    }));
  };

  const removeImage = (index: number) => {
    if (formData.imagens.length > 1) {
      setFormData(prev => ({
        ...prev,
        imagens: prev.imagens.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isEditing ? "Imóvel atualizado" : "Imóvel criado",
        description: isEditing 
          ? "As informações do imóvel foram atualizadas com sucesso."
          : "O novo imóvel foi cadastrado com sucesso.",
      });
      
      navigate('/admin/imoveis');
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o imóvel. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/admin/imoveis">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-8 w-8 text-brand-blue" />
              {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Atualize as informações do imóvel' : 'Preencha os dados do novo imóvel'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Básicos */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Básicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título *</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ex: Casa moderna com piscina"
                    className={errors.titulo ? 'border-destructive' : ''}
                  />
                  {errors.titulo && <p className="text-sm text-destructive mt-1">{errors.titulo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição *</label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Descreva os detalhes e diferenciais do imóvel..."
                    rows={4}
                    className={errors.descricao ? 'border-destructive' : ''}
                  />
                  {errors.descricao && <p className="text-sm text-destructive mt-1">{errors.descricao}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço *</label>
                    <Input
                      type="number"
                      value={formData.preco}
                      onChange={(e) => handleInputChange('preco', e.target.value)}
                      placeholder="0"
                      className={errors.preco ? 'border-destructive' : ''}
                    />
                    {errors.preco && <p className="text-sm text-destructive mt-1">{errors.preco}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo *</label>
                    <Select value={formData.tipo} onValueChange={(value: any) => handleInputChange('tipo', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status *</label>
                    <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                        <SelectItem value="alugado">Alugado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rua *</label>
                  <Input
                    value={formData.endereco.rua}
                    onChange={(e) => handleInputChange('endereco.rua', e.target.value)}
                    placeholder="Ex: Rua das Flores, 123"
                    className={errors['endereco.rua'] ? 'border-destructive' : ''}
                  />
                  {errors['endereco.rua'] && <p className="text-sm text-destructive mt-1">{errors['endereco.rua']}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bairro *</label>
                    <Input
                      value={formData.endereco.bairro}
                      onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
                      placeholder="Ex: Vila Madalena"
                      className={errors['endereco.bairro'] ? 'border-destructive' : ''}
                    />
                    {errors['endereco.bairro'] && <p className="text-sm text-destructive mt-1">{errors['endereco.bairro']}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cidade *</label>
                    <Input
                      value={formData.endereco.cidade}
                      onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
                      placeholder="Ex: São Paulo"
                      className={errors['endereco.cidade'] ? 'border-destructive' : ''}
                    />
                    {errors['endereco.cidade'] && <p className="text-sm text-destructive mt-1">{errors['endereco.cidade']}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado *</label>
                  <Select 
                    value={formData.endereco.estado} 
                    onValueChange={(value) => handleInputChange('endereco.estado', value)}
                  >
                    <SelectTrigger className={errors['endereco.estado'] ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors['endereco.estado'] && <p className="text-sm text-destructive mt-1">{errors['endereco.estado']}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Características */}
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {formData.tipo !== 'terreno' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Quartos *</label>
                        <Input
                          type="number"
                          value={formData.caracteristicas.quartos}
                          onChange={(e) => handleInputChange('caracteristicas.quartos', e.target.value)}
                          placeholder="0"
                          className={errors['caracteristicas.quartos'] ? 'border-destructive' : ''}
                        />
                        {errors['caracteristicas.quartos'] && <p className="text-sm text-destructive mt-1">{errors['caracteristicas.quartos']}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Banheiros *</label>
                        <Input
                          type="number"
                          value={formData.caracteristicas.banheiros}
                          onChange={(e) => handleInputChange('caracteristicas.banheiros', e.target.value)}
                          placeholder="0"
                          className={errors['caracteristicas.banheiros'] ? 'border-destructive' : ''}
                        />
                        {errors['caracteristicas.banheiros'] && <p className="text-sm text-destructive mt-1">{errors['caracteristicas.banheiros']}</p>}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Vagas de Garagem</label>
                    <Input
                      type="number"
                      value={formData.caracteristicas.garagem}
                      onChange={(e) => handleInputChange('caracteristicas.garagem', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Área (m²) *</label>
                    <Input
                      type="number"
                      value={formData.caracteristicas.area_m2}
                      onChange={(e) => handleInputChange('caracteristicas.area_m2', e.target.value)}
                      placeholder="0"
                      className={errors['caracteristicas.area_m2'] ? 'border-destructive' : ''}
                    />
                    {errors['caracteristicas.area_m2'] && <p className="text-sm text-destructive mt-1">{errors['caracteristicas.area_m2']}</p>}
                  </div>
                </div>

                {formData.tipo === 'apartamento' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Andar</label>
                    <Input
                      type="number"
                      value={formData.caracteristicas.andar}
                      onChange={(e) => handleInputChange('caracteristicas.andar', e.target.value)}
                      placeholder="Ex: 5"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Imagens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Imagens *
                  <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.imagens.map((imagem, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Imagem {index + 1}</span>
                      {formData.imagens.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">URL da Imagem *</label>
                        <Input
                          value={imagem.url}
                          onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição da Imagem</label>
                        <Input
                          value={imagem.alt}
                          onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                          placeholder="Descrição para acessibilidade"
                        />
                      </div>

                      {imagem.url && (
                        <div className="mt-2">
                          <img
                            src={imagem.url}
                            alt={imagem.alt || 'Preview'}
                            className="w-full h-32 object-cover rounded border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {errors.imagens && <p className="text-sm text-destructive">{errors.imagens}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button type="button" variant="outline" asChild disabled={loading}>
              <Link to="/admin/imoveis">
                Cancelar
              </Link>
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-brand-amber hover:bg-brand-amber/90"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Atualizar' : 'Salvar'} Imóvel
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminImovelForm;