'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { CheckIcon, CopyIcon } from "lucide-react"



export default function CopyButon({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        setCopied(true);
        await navigator.clipboard.writeText(text);
        setTimeout(() => setCopied(false), 2000);
    }


    return (
        <Button className='hover:cursor-pointer' aria-label="Copy" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopy()
        }} size="icon-xs">
            {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>)
}
