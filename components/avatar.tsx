import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export default async function Avatar() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    return (
        <Image
            src={user?.image || '/assets/Avatar.svg'}
            alt={user?.name || 'User Image'}
            width={40}
            height={40}
            className="rounded-full"
        />
    )
}