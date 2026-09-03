/**
 * 접속 이력 조회 서버 액션
 */
'use server';

import { requireUserId } from '@/common/session';
import type { GridRow } from '@/common/gridFns';

import * as data from './data';

export async function getUserHstList(): Promise<GridRow[]> {
  await requireUserId();

  return data.selectUserHstList() as Promise<GridRow[]>;
}
