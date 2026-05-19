import { Loader2Icon } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-96 h-full w-full">
      <Loader2Icon className="animate-spin size-8 text-app-blue-light" />
    </div>
  )
}

export default Loading