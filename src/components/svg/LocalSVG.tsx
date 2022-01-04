// import Image from 'next/image';
export enum LocalIcon {
  Animals = 'pets',
  Children = 'childs',
  Menu = 'menu',
  Male = 'male',
  Female = 'female',
  Add = 'Add',
  Call = 'Call',
  Close = 'Close',
  Delete = 'Delete',
  Done = 'Done',
  Email = 'Email',
  ExpandMore = 'ExpandMore',
  Filter = 'Filter',
  InsertInvitation = 'InsertInvitation',
  MilitaryTech = 'MilitaryTech',
  Timer = 'Timer',
  CalendarToday = 'CalendarToday',
  CalendarEvent = 'CalendarEvent'
}

interface Props {
  icon: LocalIcon;
  size: number;
  fill?: string;
}

export const LocalSVG = (props: Props) => {
  return <div className={`relative h-${props.size} w-${props.size} z-0`}>
    <SVG icon={props.icon} fill={props.fill} />
    {/*<Image*/}
    {/*  src={`/svg/${props.icon}.svg`}*/}
    {/*  alt='SVG Icon'*/}

    {/*  layout='fill'*/}
    {/*/>*/}
  </div>;
};

interface SVGSwitchProps {
  icon: LocalIcon;
  fill?: string;
}

function SVG(props: SVGSwitchProps) {
  let { icon, fill } = props;

  if (!fill) {
    fill = '#0A1931';
  }

  if (icon === LocalIcon.Children) return Children({ fill });
  if (icon === LocalIcon.Animals) return Animals({ fill });
  if (icon === LocalIcon.Menu) return Menu({ fill });
  if (icon === LocalIcon.Male) return Male({ fill });
  if (icon === LocalIcon.Female) return Female({ fill });
  if (icon === LocalIcon.Add) return Add({ fill });
  if (icon === LocalIcon.Call) return Call({ fill });
  if (icon === LocalIcon.Close) return Close({ fill });
  if (icon === LocalIcon.Delete) return Delete({ fill });
  if (icon === LocalIcon.Done) return Done({ fill });
  if (icon === LocalIcon.Email) return Email({ fill });
  if (icon === LocalIcon.ExpandMore) return ExpandMore({ fill });
  if (icon === LocalIcon.Filter) return Filter({ fill });
  if (icon === LocalIcon.InsertInvitation) return InsertInvitation({ fill });
  if (icon === LocalIcon.MilitaryTech) return MilitaryTech({ fill });
  if (icon === LocalIcon.Timer) return Timer({ fill });
  if (icon === LocalIcon.CalendarToday) return CalendarToday({ fill });
  if (icon === LocalIcon.CalendarEvent) return CalendarEvent({ fill });
  return <></>;
}

interface SVGProps {
  fill: string
}

const Children = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <circle cx='14.5' cy='10.5' r='1.25' />
    <circle cx='9.5' cy='10.5' r='1.25' />
    <path
      d='M22.94 12.66c.04-.21.06-.43.06-.66s-.02-.45-.06-.66c-.25-1.51-1.36-2.74-2.81-3.17-.53-1.12-1.28-2.1-2.19-2.91C16.36 3.85 14.28 3 12 3s-4.36.85-5.94 2.26c-.92.81-1.67 1.8-2.19 2.91-1.45.43-2.56 1.65-2.81 3.17-.04.21-.06.43-.06.66s.02.45.06.66c.25 1.51 1.36 2.74 2.81 3.17.52 1.11 1.27 2.09 2.17 2.89C7.62 20.14 9.71 21 12 21s4.38-.86 5.97-2.28c.9-.8 1.65-1.79 2.17-2.89 1.44-.43 2.55-1.65 2.8-3.17zM19 14c-.1 0-.19-.02-.29-.03-.2.67-.49 1.29-.86 1.86C16.6 17.74 14.45 19 12 19s-4.6-1.26-5.85-3.17c-.37-.57-.66-1.19-.86-1.86-.1.01-.19.03-.29.03-1.1 0-2-.9-2-2s.9-2 2-2c.1 0 .19.02.29.03.2-.67.49-1.29.86-1.86C7.4 6.26 9.55 5 12 5s4.6 1.26 5.85 3.17c.37.57.66 1.19.86 1.86.1-.01.19-.03.29-.03 1.1 0 2 .9 2 2s-.9 2-2 2zM7.5 14c.76 1.77 2.49 3 4.5 3s3.74-1.23 4.5-3h-9z' />
  </svg>
);

const Animals = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <circle cx='4.5' cy='9.5' r='2.5' />
    <circle cx='9' cy='5.5' r='2.5' />
    <circle cx='15' cy='5.5' r='2.5' />
    <circle cx='19.5' cy='9.5' r='2.5' />
    <path
      d='M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z' />
  </svg>
);

const Menu = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
  </svg>
);

const Male = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' enableBackground='new 0 0 24 24' height='100%' viewBox='0 0 24 24'
       width='100%'
       fill={props.fill}>
    <rect fill='none' height='24' width='24' />
    <path
      d='M9.5,11c1.93,0,3.5,1.57,3.5,3.5S11.43,18,9.5,18S6,16.43,6,14.5S7.57,11,9.5,11z M9.5,9C6.46,9,4,11.46,4,14.5 S6.46,20,9.5,20s5.5-2.46,5.5-5.5c0-1.16-0.36-2.23-0.97-3.12L18,7.42V10h2V4h-6v2h2.58l-3.97,3.97C11.73,9.36,10.66,9,9.5,9z' />
  </svg>
);

const Female = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' enableBackground='new 0 0 24 24' height='100%' viewBox='0 0 24 24'
       width='100%' fill={props.fill}>
    <rect fill='none' height='24' width='24' />
    <path
      d='M17.5,9.5C17.5,6.46,15.04,4,12,4S6.5,6.46,6.5,9.5c0,2.7,1.94,4.93,4.5,5.4V17H9v2h2v2h2v-2h2v-2h-2v-2.1 C15.56,14.43,17.5,12.2,17.5,9.5z M8.5,9.5C8.5,7.57,10.07,6,12,6s3.5,1.57,3.5,3.5S13.93,13,12,13S8.5,11.43,8.5,9.5z' />
  </svg>
);

const Add = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
  </svg>
);

const Call = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path
      d='M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z' />
  </svg>
);

const Close = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
  </svg>
);

const Delete = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
  </svg>
);

const Done = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' />
  </svg>
);

const Email = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path
      d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
  </svg>
);

const ExpandMore = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' />
  </svg>
);

const Filter = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' enableBackground='new 0 0 24 24' height='100%' viewBox='0 0 24 24'
       width='100%' fill={props.fill}>
    <g>
      <path d='M0,0h24 M24,24H0' fill='none' />
      <path
        d='M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z' />
      <path d='M0,0h24v24H0V0z' fill='none' />
    </g>
  </svg>
);

const InsertInvitation = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path
      d='M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' />
  </svg>
);

const MilitaryTech = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' enableBackground='new 0 0 24 24' height='100%' viewBox='0 0 24 24'
       width='100%' fill={props.fill}>
    <g>
      <rect fill='none' height='24' width='24' />
    </g>
    <g>
      <path
        d='M17,10.43V2H7v8.43c0,0.35,0.18,0.68,0.49,0.86l4.18,2.51l-0.99,2.34l-3.41,0.29l2.59,2.24L9.07,22L12,20.23L14.93,22 l-0.78-3.33l2.59-2.24l-3.41-0.29l-0.99-2.34l4.18-2.51C16.82,11.11,17,10.79,17,10.43z M13,12.23l-1,0.6l-1-0.6V3h2V12.23z' />
    </g>
  </svg>
);

const Timer = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' enableBackground='new 0 0 24 24' height='100%' viewBox='0 0 24 24'
       width='100%' fill={props.fill}>
    <g>
      <rect fill='none' height='24' width='24' />
    </g>
    <g>
      <g>
        <rect height='2' width='6' x='9' y='1' />
        <path
          d='M19.03,7.39l1.42-1.42c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42C16.07,4.74,14.12,4,12,4c-4.97,0-9,4.03-9,9 c0,4.97,4.02,9,9,9s9-4.03,9-9C21,10.88,20.26,8.93,19.03,7.39z M13,14h-2V8h2V14z' />
      </g>
    </g>
  </svg>
);

const CalendarToday = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path
      d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' />
  </svg>
);

const CalendarEvent = (props: SVGProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' height='100%' viewBox='0 0 24 24' width='100%' fill={props.fill}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path
      d='M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' />
  </svg>
);