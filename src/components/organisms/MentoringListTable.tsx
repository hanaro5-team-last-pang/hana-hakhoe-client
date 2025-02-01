'use client';

// TODO: ag-grid 표 컴포넌트 상태 관리 필요할 시 변경 필요
import { MentoringTableType } from '@/app/(main)/mypage/type';
import MentoringListTableStatus from '@/components/organisms/MentoringListTableStatus';
import { useAuth } from '@/context/AuthContext';
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
  mentorings: MentoringTableType[];
}

export default function MentoringListTable(props: Props) {
  const { mentorings } = props;
  const { role } = useAuth();
  const router = useRouter();
  ModuleRegistry.registerModules([ClientSideRowModelModule]);

  const colDefs: ColDef[] = [
    {
      field: 'title',
      headerName: '멘토링명',
      width: 250, // 기본 너비 설정 (px 단위)
      minWidth: 210,
    },
    {
      field: 'start_date',
      headerName: '날짜',
      width: 160, // 기본 너비 설정
      minWidth: 140,
    },
    // 멘토일 경우 강사명 컬럼 제거
    ...(role === 'mentor'
      ? []
      : [
          {
            field: 'mentorName',
            headerName: '강사명',
            width: 100,
            minWidth: 70,
          },
        ]),
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      minWidth: 110,
      cellRenderer: MentoringListTableStatus,
    },
    {
      field: 'review',
      headerName: role === 'mentor' ? '멘토링 수정하기' : '리뷰', // 역할에 따라 컬럼 헤더 변경
      width: 140,
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
      className={`min-h-[135px] h-[500px] w-full overflow-y-auto scrollbar-hide`}
    >
      <AgGridReact
        rowData={mentorings}
        columnDefs={colDefs}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}
