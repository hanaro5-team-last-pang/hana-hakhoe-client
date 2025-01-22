'use client';

// TODO: ag-grid 표 컴포넌트 상태 관리 필요할 시 변경 필요
import MentoringListTableStatus from '@/components/organisms/MentoringListTableStatus';
import { MentoringType } from '@/types/hanaHakdang';
import {
  ModuleRegistry,
  ColDef,
  ClientSideRowModelModule,
  RowClickedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  mentorings: MentoringType[];
}

export default function MentoringListTable(props: Props) {
  const { mentorings } = props;
  const router = useRouter();
  ModuleRegistry.registerModules([ClientSideRowModelModule]);

  const colDefs: ColDef[] = [
    {
      field: 'mentoringName',
      headerName: '멘토링명',
      width: 250, // 기본 너비 설정 (px 단위)
      minWidth: 210,
    },
    {
      field: 'mentoringDate',
      headerName: '날짜',
      width: 160, // 기본 너비 설정
      minWidth: 140,
    },
    {
      field: 'mentorName',
      headerName: '강사명',
      width: 100,
      minWidth: 70, // 최소 너비 설정
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      minWidth: 110,
      cellRenderer: MentoringListTableStatus,
    },
    {
      field: 'review',
      headerName: '리뷰',
      width: 100,
      minWidth: 110,
    },
  ];

  const handleRowClick = useCallback(
    (event: RowClickedEvent) => {
      const rowId = event.data.id;
      router.push(`/mentorings/${rowId}`);
    },
    [router]
  );

  return (
    <div
      className={`min-h-[135px] max-h-[500px] w-full overflow-y-auto scrollbar-hide`}
    >
      <AgGridReact
        rowData={mentorings}
        columnDefs={colDefs}
        onRowClicked={handleRowClick}
        className="font-fontLight"
      />
    </div>
  );
}
