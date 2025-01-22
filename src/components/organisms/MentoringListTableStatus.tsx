import { Badge } from '@/components/atoms/Badge';
import type { ICellRendererParams } from 'ag-grid-community';

export default function MentoringListTableStatus(params: ICellRendererParams) {
  return (
    <Badge
      className={`font-fontLight text-xs rounded-lg mr-3 ${
        params.value === '멘토링 예약'
          ? 'bg-purple-200 text-badgePurple'
          : 'bg-green-200 text-badgeGreen'
      }`}
      text={params.value}
    />
  );
}
