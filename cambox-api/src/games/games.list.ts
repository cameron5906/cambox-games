import { GameDetails } from "@cambox/common/types/models/GameDetails";

export const MADLIBS_ID: string = 'madlibs';
export const SPLIT_THE_ROOM_ID: string = 'splittheroom';

export default [
    {
        id: MADLIBS_ID,
        name: 'Mad Libs',
        description: 'Who can come up with the funniest story?',
        iconUrl: 'https://www.perkinselearning.org/sites/elearning.perkinsdev1.org/files/styles/node_highlighted_image/public/Mad_Libs_logo.png?itok=w4w5j4AS'
    },
    {
        id: SPLIT_THE_ROOM_ID,
        name: 'Split the Room',
        description: 'In this surreal game of what-ifs, players are given a weird hypothetical situation that’s missing one key detail.',
        iconUrl: 'https://cdnb.artstation.com/p/assets/images/images/015/621/881/large/carson-kelley-artstat-45.jpg?1548995187'
    }
] as GameDetails[];