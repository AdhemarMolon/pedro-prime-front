import { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

interface FormContatoProps {
  imovelTitulo?: string;
  className?: string;
}

const FormContato = ({ imovelTitulo, className = '' }: FormContatoProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone.replace(/\D/g, '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3'))) {
      // Formato aceito mas não obrigatório: (11) 99999-9999
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    } else if (formData.mensagem.trim().length < 10) {
      newErrors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    handleInputChange('telefone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Dados inválidos",
        description: "Por favor, corrija os erros antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSuccess(false);

    // Enviar via WhatsApp
    try {
      const whatsappNumber = '5516997527532';
      const message = `*Nova mensagem do site*\n\n` +
        `*Nome:* ${formData.nome}\n` +
        `*Email:* ${formData.email}\n` +
        `*Telefone:* ${formData.telefone}\n` +
        `${imovelTitulo ? `*Imóvel:* ${imovelTitulo}\n` : ''}` +
        `\n*Mensagem:*\n${formData.mensagem}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Aguardar um pouco para dar tempo do usuário ver a ação
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      toast({
        title: "Redirecionado para WhatsApp!",
        description: "Continue a conversa pelo WhatsApp para receber um atendimento mais rápido.",
      });

      // Resetar formulário após 3 segundos
      setTimeout(() => {
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          mensagem: ''
        });
        setSuccess(false);
      }, 3000);

    } catch (error) {
      toast({
        title: "Erro ao processar",
        description: "Tente novamente ou entre em contato por telefone: (16) 99752-7532",
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

  if (success) {
    return (
      <div className={`bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg border border-green-200 ${className}`}>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            Mensagem Enviada!
          </h3>
          <p className="text-green-700 mb-4">
            Recebemos sua mensagem e entraremos em contato em breve.
          </p>
          <div className="text-sm text-green-600 bg-green-100 rounded-lg p-3">
            <strong>Próximos passos:</strong> Nossa equipe analisará sua solicitação e retornará em até 2 horas úteis.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 lg:p-8 shadow-xl border border-blue-100 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-2">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Entre em Contato
          </h3>
          <p className="text-sm text-gray-600">
            Resposta garantida em até 2 horas úteis
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className={`pl-12 h-12 bg-white border-2 transition-all duration-200 ${
                errors.nome 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
              disabled={loading}
            />
          </div>
          {errors.nome && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.nome}
            </div>
          )}
        </div>

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="email"
              placeholder="Seu melhor email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`pl-12 h-12 bg-white border-2 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handlePhoneChange}
              className={`pl-12 h-12 bg-white border-2 transition-all duration-200 ${
                errors.telefone 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              }`}
              disabled={loading}
            />
          </div>
          {errors.telefone && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.telefone}
            </div>
          )}
        </div>

        <div>
          <Textarea
            placeholder="Conte-nos sobre seu interesse. Quanto mais detalhes, melhor poderemos ajudá-lo!"
            value={formData.mensagem}
            onChange={(e) => handleInputChange('mensagem', e.target.value)}
            className={`resize-none bg-white border-2 transition-all duration-200 ${
              errors.mensagem 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
            }`}
            rows={4}
            disabled={loading}
          />
          {errors.mensagem && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.mensagem}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando mensagem...
            </div>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Enviar Mensagem
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 rounded-full p-1 mt-0.5">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">
              Seus dados estão protegidos
            </p>
            <p className="text-xs text-blue-700">
              Seguimos a LGPD e utilizamos suas informações apenas para entrar em contato sobre sua solicitação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContato;