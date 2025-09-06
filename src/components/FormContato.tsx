import { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface FormContatoProps {
  imovelTitulo?: string;
  className?: string;
}

const FormContato = ({ imovelTitulo, className = '' }: FormContatoProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: imovelTitulo 
      ? `Olá! Tenho interesse no imóvel "${imovelTitulo}". Gostaria de mais informações.`
      : ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simular envio do formulário
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular sucesso/erro aleatório
      const sucesso = Math.random() > 0.2; // 80% de chance de sucesso
      
      if (sucesso) {
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Entraremos em contato em breve. Obrigado pelo interesse!",
        });
        
        // Resetar formulário
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          mensagem: ''
        });
      } else {
        throw new Error('Erro simulado');
      }
      
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns minutos ou entre em contato por telefone.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`bg-card rounded-xl p-6 shadow-medium border border-border ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-brand-blue" />
        <h3 className="text-xl font-semibold text-card-foreground">
          Entre em Contato
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className={`pl-10 ${errors.nome ? 'border-destructive' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.nome && (
            <p className="text-sm text-destructive mt-1">{errors.nome}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="email"
              placeholder="Seu melhor email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="tel"
              placeholder="Seu telefone com WhatsApp"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              className={`pl-10 ${errors.telefone ? 'border-destructive' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.telefone && (
            <p className="text-sm text-destructive mt-1">{errors.telefone}</p>
          )}
        </div>

        <div>
          <Textarea
            placeholder="Sua mensagem..."
            value={formData.mensagem}
            onChange={(e) => handleInputChange('mensagem', e.target.value)}
            className={`resize-none ${errors.mensagem ? 'border-destructive' : ''}`}
            rows={4}
            disabled={loading}
          />
          {errors.mensagem && (
            <p className="text-sm text-destructive mt-1">{errors.mensagem}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-amber hover:bg-brand-amber/90 text-white font-semibold py-2.5"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando...
            </div>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Mensagem
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          Seus dados estão seguros conosco e serão utilizados apenas para entrarmos em contato.
        </p>
      </div>
    </div>
  );
};

export default FormContato;