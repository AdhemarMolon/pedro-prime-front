import React, { useState } from 'react';
import { Check, X, Tag as TagIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { TAGS_DISPONIVEIS, getTagConfig } from '../lib/constants';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange, maxTags = 5 }) => {
  const [open, setOpen] = useState(false);

  const handleToggleTag = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      onChange(selectedTags.filter(t => t !== tagValue));
    } else {
      if (maxTags && selectedTags.length >= maxTags) {
        alert(`Você pode selecionar no máximo ${maxTags} tags`);
        return;
      }
      onChange([...selectedTags, tagValue]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Tags do Imóvel
        </label>
        <span className="text-xs text-gray-500">
          {selectedTags.length}/{maxTags} selecionadas
        </span>
      </div>

      {/* Tags Selecionadas */}
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 bg-gray-50 rounded-lg border border-gray-200">
        {selectedTags.length === 0 ? (
          <span className="text-sm text-gray-400 italic">Nenhuma tag selecionada</span>
        ) : (
          selectedTags.map(tag => {
            const config = getTagConfig(tag);
            return (
              <Badge
                key={tag}
                className={`${config.color} border px-3 py-1 flex items-center gap-1 cursor-pointer hover:opacity-80`}
                onClick={() => handleToggleTag(tag)}
              >
                {config.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })
        )}
      </div>

      {/* Botão para abrir seletor */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <TagIcon className="mr-2 h-4 w-4" />
            Adicionar Tags
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-4" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-semibold text-sm">Selecione as Tags</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
                className="text-xs h-7"
              >
                Limpar todas
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {TAGS_DISPONIVEIS.map(tag => {
                const isSelected = selectedTags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    onClick={() => handleToggleTag(tag.value)}
                    className={`
                      flex items-center justify-between p-2 rounded-md border-2 transition-all text-left
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-xs font-medium truncate pr-2">{tag.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Dicas */}
      <p className="text-xs text-gray-500">
        💡 Dica: As tags ajudam os clientes a encontrarem o imóvel ideal mais rapidamente!
      </p>
    </div>
  );
};

export default TagSelector;
