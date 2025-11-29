import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onExport: () => void;
  onImport: () => void;
}

const Header = ({ onExport, onImport }: HeaderProps) => {
  return (
    <header className="bg-header text-white border-b border-border/20 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-white font-bold text-sm">
            AC
          </div>
          <h1 className="text-lg font-semibold">Agenda de Contactos</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onImport}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          
          <Button
            onClick={onExport}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
