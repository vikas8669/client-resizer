'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';

interface PdfPasswordModalProps {
  isOpen: boolean;
  fileName: string;
  documentCategory: string; // 'aadhaar' | 'pan' | 'driving-licence' | 'voter-id' | 'passport-id' | 'other'
  onUnlock: (password: string) => Promise<boolean>;
  onClose: () => void;
}

export function PdfPasswordModal({
  isOpen,
  fileName,
  documentCategory,
  onUnlock,
  onClose,
}: PdfPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>(documentCategory || 'aadhaar');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter the document password');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const success = await onUnlock(password.trim());
      if (success) {
        setPassword('');
      } else {
        setErrorMessage('Incorrect password. Please check the example format below and try again.');
      }
    } catch {
      setErrorMessage('Failed to unlock PDF. Please verify your password.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordHelper = () => {
    switch (selectedDocType) {
      case 'aadhaar':
        return {
          title: 'Aadhaar Card Password Format',
          rule: 'First 4 letters of your NAME in CAPITAL + Year of Birth (YYYY)',
          examples: [
            { text: 'Name: VIKAS KUMAR, Year: 2002', pwd: 'VIKA2002' },
            { text: 'Name: S. B. OMAX, Year: 2002', pwd: 'BOMX2002' },
            { text: 'Name: RIA, Year: 1998', pwd: 'RIA1998' },
          ],
        };
      case 'pan':
        return {
          title: 'e-PAN Card Password Format',
          rule: 'Date of Birth in DDMMYYYY format without spaces or slashes',
          examples: [
            { text: 'DOB: 10th July 2002', pwd: '10072002' },
            { text: 'DOB: 5th January 1995', pwd: '05011995' },
          ],
        };
      case 'driving-licence':
      case 'voter-id':
      default:
        return {
          title: 'Document Password Format',
          rule: 'Usually your Date of Birth (DDMMYYYY) or Mobile Number used while downloading',
          examples: [
            { text: 'Date of Birth (DDMMYYYY)', pwd: '10072002' },
            { text: 'First 4 letters of Name + Year', pwd: 'VIKA2002' },
          ],
        };
    }
  };

  const helper = getPasswordHelper();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
                Password-Protected PDF
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[280px]">
                {fileName} requires a password to open
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Document Type Selector for Password Hints */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Which document is this?
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'aadhaar', name: 'Aadhaar Card' },
                { id: 'pan', name: 'PAN Card' },
                { id: 'other', name: 'Other Document' },
              ].map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    setSelectedDocType(doc.id);
                    setErrorMessage(null);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedDocType === doc.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {doc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Enter PDF Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder={selectedDocType === 'aadhaar' ? 'e.g. VIKA2002' : 'Enter password'}
                autoFocus
                className="pr-10 text-sm font-semibold rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Helper / Example Box */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{helper.title}</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
              {helper.rule}
            </p>
            <div className="space-y-1 pt-1 border-t border-zinc-200/60 dark:border-white/5">
              {helper.examples.map((ex, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">{ex.text}</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/40">
                    {ex.pwd}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
            >
              {isLoading ? 'Unlocking PDF...' : 'Unlock & Open PDF'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
