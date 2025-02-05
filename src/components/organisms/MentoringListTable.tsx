'use client';

// TODO: ag-grid 표 컴포넌트 상태 관리 필요할 시 변경 필요
import { MentoringTableType } from '@/app/(main)/mypage/type';
import Button from '@/components/atoms/Button';
import MentoringListTableStatus from '@/components/organisms/MentoringListTableStatus';
import { useAuthStore } from '@/context/AuthContext';
import {
  ModuleRegistry,
  ColDef,
  ClientSideRowModelModule,
  RowClickedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { redirect, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  mentorings: MentoringTableType[];
}

export default function MentoringListTable(props: Props) {
  const { mentorings } = props;
  const auth = useAuthStore((state) => state.auth);
  const role = auth ? auth.role : '';
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
    ...(role === 'MENTOR'
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
    // "강의실 입장" 또는 "리뷰 남기기" 컬럼 설정
    {
      field: 'class',
      headerName: role === 'MENTOR' ? '강의 시작 상태' : '강의실',
      width: 130,
      minWidth: 110,
      cellRenderer: (params: ICellRendererParams) => {
        const buttonText =
          params.data.status === '수강 완료'
            ? '리뷰 남기기'
            : role === 'MENTOR'
              ? '강의 시작'
              : '강의실 입장';

        return (
          <Button
            type="button"
            text={`${buttonText}`}
            className="bg-red-50 text-pink-900 rounded-lg p-2 text-xs font-fontMedium"
          />
        );
      },
      onCellClicked: async (params) => {
        if (params.data.status === '수강 완료') {
          // '리뷰 남기기' 버튼 클릭 시 처리 로직
          redirect(`/reviews/${params.data.id}`);
        } else {
          if (role === 'MENTOR') {
            redirect(`/classrooms/${params.data.classroomId}`);
          } else {
            redirect(`/classrooms/${params.data.classroomId}`);
          }
        }
      },
    },
    // 멘토일 때 "멘토링 삭제" 컬럼 추가
    ...(role === 'MENTOR'
      ? [
          {
            field: 'delete',
            headerName: '멘토링 삭제',
            width: 130,
            minWidth: 110,
            cellRenderer: 'buttonRenderer',
            // deletelecture action 추가
          },
        ]
      : []),
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
      className={`min-h-[135px] h-[215px] w-full overflow-y-auto scrollbar-hide`}
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
