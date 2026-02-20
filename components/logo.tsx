import Image from 'next/image'
import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-1', className)}>
            <Image
                src="/logo.png"
                alt="IskoArena Logo"
                width={50}
                height={50}
                className="object-contain"
            />
            <span className="text-xl font-[500] tracking-tight">IskoArena</span>
        </div>
    )
}

export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/logo.png"
            alt="IskoArena"
            width={50}
            height={50}
            className={cn('object-contain', className)}
        />
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/logo.png"
            alt="IskoArena"
            width={28}
            height={28}
            className={cn('object-contain', className)}
        />
    )
}
