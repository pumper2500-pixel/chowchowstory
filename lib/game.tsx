"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DOGS, LEVELS, earn as earnPure, levelOf, todayKey } from "@/lib/game-core.mjs";

// Milestone 01: เก็บในเครื่อง (localStorage) · Milestone 02: sync กับตาราง profiles ใน Supabase
const KEY = "ccs-game-v1";

type GameState = { bones: number; done: Record<string, boolean> };
type Toast = { id: number; html: string };

type Ctx = {
  state: GameState;
  ready: boolean;
  preview: boolean;
  setPreview: (v: boolean) => void;
  shownBones: number;
  today: string;
  earn: (key: string, pts: number, label: string) => boolean;
  toast: Toast | null;
  showToast: (html: string) => void;
  levelUpTick: number;
};

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({ bones: 0, done: {} });
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [levelUpTick, setLevelUpTick] = useState(0);
  const stateRef = useRef(state);
  const today = useMemo(() => todayKey(), []);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw && typeof raw.bones === "number") {
        const s = { bones: raw.bones, done: raw.done || {} };
        stateRef.current = s;
        setState(s);
      }
    } catch {}
    setReady(true);
  }, []);

  const showToast = useCallback((html: string) => {
    const id = Date.now();
    setToast({ id, html });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2600);
  }, []);

  const earn = useCallback((key: string, pts: number, label: string) => {
    const r = earnPure(stateRef.current, key, pts);
    if (!r.gained) return false;
    stateRef.current = r.state;
    setState(r.state);
    try { localStorage.setItem(KEY, JSON.stringify(r.state)); } catch {}
    if (r.levelUp) {
      const li = levelOf(r.state.bones);
      showToast(`เลเวลอัป! <b>${LEVELS[li].name}</b> · ${DOGS[li].name} เดินเข้ามาแล้ว`);
      setLevelUpTick((n) => n + 1);
    } else {
      showToast(`+${pts} 🦴 ${label}`);
    }
    return true;
  }, [showToast]);

  const value: Ctx = {
    state, ready, preview, setPreview,
    shownBones: preview ? LEVELS[LEVELS.length - 1].min : state.bones,
    today, earn, toast, showToast, levelUpTick,
  };
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("useGame ต้องอยู่ใน GameProvider");
  return c;
}

// ให้แต้มครั้งเดียวเมื่อเปิดหน้า (ใช้กับ "เปิดแอปวันนี้")
export function useEarnOnMount(key: string, pts: number, label: string, delay = 900) {
  const { ready, earn } = useGame();
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => earn(key, pts, label), delay);
    return () => clearTimeout(t);
  }, [ready, key, pts, label, delay, earn]);
}
