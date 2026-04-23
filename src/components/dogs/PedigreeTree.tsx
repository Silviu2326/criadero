import { Link } from 'react-router-dom';
import { Dog } from 'lucide-react';

export interface PedigreeNodeData {
  id: string;
  dog?: { id: string; name: string; breed?: { name: string } };
  generation: number;
  father?: PedigreeNodeData;
  mother?: PedigreeNodeData;
}

function PedigreeCard({ node }: { node?: PedigreeNodeData }) {
  if (!node) {
    return (
      <div className="card p-3 min-w-[10rem] border-dashed border-2 border-apple-gray-300 bg-apple-gray-50">
        <p className="text-sm text-apple-gray-300 text-center">Desconocido</p>
      </div>
    );
  }

  const content = (
    <div className="card p-3 min-w-[10rem] hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-apple-gray flex items-center justify-center">
          <Dog size={16} className="text-apple-gray-200" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-apple-black truncate">{node.dog?.name}</p>
          <p className="text-xs text-apple-gray-300 truncate">{node.dog?.breed?.name}</p>
        </div>
      </div>
    </div>
  );

  if (node.dog?.id) {
    return (
      <Link to={`/dogs/${node.dog.id}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function renderPedigreeRow(nodes: (PedigreeNodeData | undefined)[], keyPrefix: string) {
  return (
    <div className="flex items-center justify-center gap-4">
      {nodes.map((n, idx) => (
        <PedigreeCard key={`${keyPrefix}-${idx}`} node={n} />
      ))}
    </div>
  );
}

export function PedigreeTree({ pedigree }: { pedigree?: PedigreeNodeData }) {
  if (!pedigree) {
    return (
      <div className="card p-6 overflow-x-auto">
        <div className="min-w-[40rem] space-y-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-100">Generación 0</p>
          </div>
          {renderPedigreeRow([], 'g0')}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-100">Generación 1</p>
          </div>
          {renderPedigreeRow([undefined, undefined], 'g1')}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-100">Generación 2</p>
          </div>
          {renderPedigreeRow([undefined, undefined, undefined, undefined], 'g2')}
        </div>
      </div>
    );
  }

  const gen0 = [pedigree];
  const gen1 = [pedigree.father, pedigree.mother];
  const gen2 = [
    pedigree.father?.father,
    pedigree.father?.mother,
    pedigree.mother?.father,
    pedigree.mother?.mother,
  ];

  return (
    <div className="card p-6 overflow-x-auto">
      <div className="min-w-[40rem] space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-100">Generación 0</p>
        </div>
        {renderPedigreeRow(gen0, 'g0')}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-100">Generación 1</p>
        </div>
        {renderPedigreeRow(gen1, 'g1')}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-apple-gray-100">Generación 2</p>
        </div>
        {renderPedigreeRow(gen2, 'g2')}
      </div>
    </div>
  );
}
