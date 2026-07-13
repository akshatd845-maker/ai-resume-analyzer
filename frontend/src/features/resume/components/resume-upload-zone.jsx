import { useCallback, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, FileUp, Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  ACCEPTED_RESUME_TYPE,
  MAX_RESUME_SIZE,
  validateResumeFile,
} from '@/features/resume/services/resume.service'
import { formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const states = {
  idle: 'idle',
  dragging: 'dragging',
  uploading: 'uploading',
  success: 'success',
  error: 'error',
}

export function ResumeUploadZone({
  onUpload,
  onReplace,
  replaceTarget,
  onCancelReplace,
  compact = false,
  className,
}) {
  const inputRef = useRef(null)
  const [dragState, setDragState] = useState(states.idle)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const isReplace = Boolean(replaceTarget)
  const isBusy = dragState === states.uploading

  const reset = useCallback(() => {
    setDragState(states.idle)
    setProgress(0)
    setError(null)
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const retryLastUpload = useCallback(async () => {
    if (!selectedFile) return

    const onProgress = (event) => {
      if (event.total) {
        setProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    setDragState(states.uploading)
    setProgress(0)
    setError(null)

    try {
      if (isReplace) {
        await onReplace({ oldId: replaceTarget.id, file: selectedFile, onProgress })
        toast.success('Resume replaced successfully')
      } else {
        await onUpload({ file: selectedFile, onProgress })
        toast.success('Resume uploaded successfully')
      }
      setDragState(states.success)
      setTimeout(reset, 2000)
    } catch (err) {
      const message = err?.response?.data?.message ?? 'Upload failed. Please try again.'
      setError(message)
      setDragState(states.error)
      toast.error(message)
    }
  }, [
    isReplace,
    onReplace,
    onUpload,
    replaceTarget,
    reset,
    selectedFile,
  ])


  const handleFile = useCallback(
    async (file) => {
      const validationError = validateResumeFile(file)
      if (validationError) {
        setError(validationError)
        setDragState(states.error)
        return
      }

      setSelectedFile(file)
      setDragState(states.uploading)
      setProgress(0)
      setError(null)

      const onProgress = (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded / event.total) * 100))
        }
      }

      try {
        if (isReplace) {
          await onReplace({ oldId: replaceTarget.id, file, onProgress })
          toast.success('Resume replaced successfully')
        } else {
          await onUpload({ file, onProgress })
          toast.success('Resume uploaded successfully')
        }
        setDragState(states.success)
        setTimeout(reset, 2000)
      } catch (err) {
        const message = err?.response?.data?.message ?? 'Upload failed. Please try again.'
        setError(message)
        setDragState(states.error)
        toast.error(message)
      }
    },
    [isReplace, onUpload, onReplace, replaceTarget, reset],
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragState(states.idle)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isBusy) setDragState(states.dragging)
  }, [isBusy])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragState(states.idle)
  }, [])

  const onInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-3', className)}
    >
      {isReplace ? (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="truncate text-caption">
            Replacing <span className="font-medium">{replaceTarget.originalFileName}</span>
          </p>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCancelReplace}
            aria-label="Cancel replace"
          >
            <X className="size-3" />
          </Button>
        </div>
      ) : null}

      <div
        role="button"
        tabIndex={0}
        aria-label={isReplace ? 'Replace resume file' : 'Upload resume file'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !isBusy && inputRef.current?.click()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          compact ? 'py-8' : 'py-12',
          dragState === states.dragging
            ? 'border-primary bg-primary/5'
            : dragState === states.error
              ? 'border-destructive/50 bg-destructive/5'
              : dragState === states.success
                ? 'border-success/50 bg-success/5'
                : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30',
          isBusy && 'pointer-events-none',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_RESUME_TYPE}
          className="sr-only"
          onChange={onInputChange}
          disabled={isBusy}
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          {dragState === states.uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full flex-col items-center gap-3"
            >
              <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
              <p className="text-small font-medium">Uploading…</p>
              {selectedFile ? (
                <p className="text-caption text-text-secondary">{selectedFile.name}</p>
              ) : null}
              <Progress value={progress} className="w-full max-w-xs" aria-label="Upload progress" />
              <p className="text-caption text-text-secondary tabular-nums">{progress}%</p>
            </motion.div>
          ) : dragState === states.success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
              <p className="text-small font-medium">Upload complete</p>
            </motion.div>
          ) : dragState === states.error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
              <p className="text-small font-medium text-destructive">Upload failed</p>
              <p className="text-caption text-text-secondary max-w-xs">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  retryLastUpload()
                }}
              >
                Retry upload
              </Button>

            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className={cn(
                "flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300",
                dragState === states.dragging && "bg-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.25)] scale-110",
              )}>
                {dragState === states.dragging ? (
                  <FileUp className="size-5" aria-hidden="true" />
                ) : (
                  <Upload className="size-5" aria-hidden="true" />
                )}
              </div>
              <p className="text-small font-medium">
                {dragState === states.dragging
                  ? 'Drop your PDF here'
                  : isReplace
                    ? 'Drop a new PDF to replace'
                    : 'Drag & drop your resume'}
              </p>
              <p className="text-caption text-text-secondary">
                or <span className="text-primary font-medium">click to browse</span> · PDF only · max {formatBytes(MAX_RESUME_SIZE)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
