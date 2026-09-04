import {fireEvent,render,screen} from '@testing-library/react';
import {vi} from 'vitest';
import ErrorBoundary from './(app)/error';
import Loading from './(app)/loading';
it('announces loading state',()=>{render(<Loading/>);expect(screen.getByRole('status')).toHaveTextContent('화면을 불러오는 중입니다')});
it('announces an error and retries',()=>{const reset=vi.fn();render(<ErrorBoundary error={new Error('hidden')} reset={reset}/>);expect(screen.getByRole('alert')).toHaveTextContent('화면을 불러오지 못했습니다');fireEvent.click(screen.getByRole('button',{name:'다시 시도'}));expect(reset).toHaveBeenCalledOnce()});
