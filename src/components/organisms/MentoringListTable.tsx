'use client';

// TODO: ag-grid 표 컴포넌트 상태 관리 필요할 시 변경 필요
import { withdrawLecture } from '@/app/(main)/mentorings/[id]/actions';
import { withdrawMentorLecture } from '@/app/(main)/mypage/actions';
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
import { toast } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  mentorings: MentoringTableType[];
  histories: MentoringTableType[];
}

export default function MentoringListTable(props: Props) {
  const { mentorings } = props;
  const auth = useAuthStore((state) => state.auth);
  const role = auth ? auth.role : '';
  const router = useRouter();
  ModuleRegistry.registerModules([ClientSideRowModelModule]);

  const handleWithdraw = async (enrollmentId: number) => {
    try {
      await withdrawLecture(enrollmentId);
      toast.success('정상적으로 취소되었습니다.');
    } catch {
      toast.warn('수강 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleMentorWithdraw = async (lectureId: number) => {
    try {
      await withdrawMentorLecture(lectureId);
      toast.success('정상적으로 삭제되었습니다.');
    } catch {
      toast.warn('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const colDefs: ColDef[] = [
    {
      field: 'title',
      headerName: '멘토링명',
      width: 220,
      minWidth: 210,
    },
    {
      field: 'start_date',
      headerName: '날짜',
      width: 160,
      minWidth: 140,
    },
    ...(role === 'MENTOR'
      ? []
      : [
          {
            field: 'mentorName',
            headerName: '강사명',
            width: 90,
            minWidth: 70,
          },
        ]),
    {
      field: 'status',
      headerName: '상태',
      width: 110,
      minWidth: 110,
      cellRenderer: MentoringListTableStatus,
    },
    {
      field: 'class',
      headerName: role === 'MENTOR' ? '강의실 연결' : '강의실',
      width: 110,
      minWidth: 110,
      cellRenderer: (params: ICellRendererParams) => {
        const status = params.data.status;

        let buttonText = '';
        if (status !== '취소됨') {
          buttonText =
            status === '수강 완료'
              ? '리뷰 보기'
              : role === 'MENTOR' && status === '완료'
                ? '종료됨'
                : '입장 시작';
        }
        return buttonText ? (
          <Button
            type="button"
            text={buttonText}
            className="bg-blue-50 text-blue-900 rounded-lg p-2 text-xs font-fontMedium"
          />
        ) : null;
      },
      onCellClicked: async (params) => {
        if (params.data.status !== '취소됨') {
          if (params.data.status === '수강 완료') {
            redirect(`/mentorings/${params.data.lectureId}`);
          } else {
            redirect(`/classrooms/${params.data.classroomId}`);
          }
        }
      },
    },
    ...(role === 'MENTOR'
      ? [
          {
            field: 'delete',
            headerName: '멘토링 삭제',
            width: 130,
            minWidth: 110,
            cellRenderer: (params: ICellRendererParams) => {
              if (params.data.status === '멘토 오픈 전') {
                return (
                  <button
                    onClick={() => handleMentorWithdraw(params.data.lectureId)}
                    className="bg-red-50 text-pink-900 rounded-lg p-2 text-xs font-fontMedium"
                  >
                    삭제하기
                  </button>
                );
              }
              return null;
            },
          },
        ]
      : []),
    // Add "수강 취소" column
    role === 'MENTEE' && {
      field: 'withdraw',
      headerName: '수강 취소',
      width: 100,
      minWidth: 90,
      cellRenderer: (params: ICellRendererParams) => {
        if (params.data.status === '시작 전') {
          return (
            <button
              onClick={() => handleWithdraw(params.data.enrollmentId)}
              className="bg-red-50 text-pink-900 rounded-lg p-2 text-xs font-fontMedium"
            >
              취소하기
            </button>
          );
        }
        if (
          (params.data.isEnrollmentCanceled || params.data.isLecutrCanceled) ===
          true
        ) {
          return (
            <button className="bg-red-50 text-pink-900 rounded-lg p-2 text-xs font-fontMedium">
              취소 완료
            </button>
          );
        }
        return null;
      },
    },
  ].filter((column) => column !== false);

  const handleRowClick = useCallback(
    (event: RowClickedEvent) => {
      const lectureId = event.data.lectureId;
      console.log(lectureId);
      router.push(`/mentorings/${lectureId}`);
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
