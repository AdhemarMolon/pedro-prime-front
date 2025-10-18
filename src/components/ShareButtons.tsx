import { Share2, MessageCircle, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

const ShareButtons = ({ title, description, url, imageUrl }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = url || window.location.href;
  const shareTitle = title;
  const shareDescription = description || 'Confira este imóvel incrível!';

  const handleWhatsApp = () => {
    const text = `${shareTitle}\n\n${shareDescription}\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    }
  };

  // Se o navegador suporta Web Share API (mobile principalmente)
  if (navigator.share) {
    return (
      <Button
        onClick={handleNativeShare}
        variant="outline"
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Compartilhar
      </Button>
    );
  }

  // Desktop: dropdown com opções
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleWhatsApp} className="gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4 text-green-600" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebook} className="gap-2 cursor-pointer">
          <Facebook className="h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Link copiado!</span>
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4" />
              <span>Copiar link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButtons;
