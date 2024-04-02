import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createDateInputQueryString, createSelectInputQueryString } from '@/helpers/createQueryString';
import { formatDateGetDayAndYear, formatToDateTime, isNotWithinThirtyDaysRange } from '@/utils/date';
import { validateDate, validateEmployee, validateStatus } from '@/helpers/validateSearchParams';
import { CheckCircle2, CircleDot, CircleSlash, Contact, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatScheduleCaption } from '@/utils/caption';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import { statuses, User } from '@/lib/schemas';
import { Calendar } from './ui/calendar';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const DashboardTableFilters = ({ employees }: { employees: User[] }) => {
  const searchParams = useSearchParams();
  const validEmployees = employees.map(({ name }) => name);

  const StatusIcons = {
    PAID: <CheckCircle2 className='size-5' />,
    BREAK: <CircleSlash className='size-5' />,
    PENDING: <CircleDot className='size-5' />,
    CANCELED: <XCircle className='size-5' />,
  };

  const selectedEmployee = validateEmployee(searchParams.get('employee'), validEmployees, employees[0].name);
  const selectedDate = validateDate(searchParams.get('date'), String(new Date()));
  const selectedStatus = validateStatus(searchParams.get('status'), 'PENDING');

  const employeePlaceholder = searchParams.get('employee') ? (
    <div className='flex gap-2'>
      <Contact className='size-5' />
      {selectedEmployee}
    </div>
  ) : (
    'Escolha do Profissional'
  );

  const statusPlaceholder = searchParams.get('status') ? (
    <div className='flex gap-2'>
      {StatusIcons[selectedStatus]}
      {formatScheduleCaption(selectedStatus)}
    </div>
  ) : (
    'Status do Agendamento'
  );

  const datePlaceholder = searchParams.get('date')
    ? formatDateGetDayAndYear(selectedDate)
    : 'Data do Agendamento';

  return (
    <div className='flex gap-2 max-[1100px]:w-full max-[1100px]:flex-col'>
      <div className='flex w-[215px] flex-col gap-2 max-[1100px]:w-full'>
        <Select
          onValueChange={(status) =>
            createSelectInputQueryString({ inputKey: 'status', selectInput: status, searchParams })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={statusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statuses.map((status) => {
                return (
                  <SelectItem key={status} value={status}>
                    <div className='flex gap-2'>
                      {StatusIcons[status]}
                      {formatScheduleCaption(status)}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='flex w-[235px] flex-col gap-2 max-[1100px]:w-full'>
        <Select
          onValueChange={(employee) =>
            createSelectInputQueryString({ inputKey: 'employee', selectInput: employee, searchParams })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={employeePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {employees.map((employee) => {
                return (
                  <SelectItem key={employee.id} value={employee.name}>
                    <div className='flex gap-2'>
                      <Contact className='size-5' />
                      {employee.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='flex w-[225px] flex-col gap-2 max-[1100px]:w-full'>
        <Popover>
          <PopoverTrigger asChild className='px-3'>
            <Button variant='outline' className={cn('justify-start gap-2 text-left font-normal')}>
              <CalendarIcon className='size-5' />
              {datePlaceholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              initialFocus
              locale={ptBR}
              selected={new Date(selectedDate)}
              disabled={(date) => isNotWithinThirtyDaysRange(date)}
              onSelect={(date) =>
                createDateInputQueryString({ dateInput: formatToDateTime(date), searchParams })
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
