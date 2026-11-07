"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  LoaderCircle,
  Pencil,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { GAMES_WELCOME_START_EVENT } from "@/components/features/games/games-startup-audio";

const PROFILE_STORAGE_KEY = "gta6.games.player-profile.v1";
const USERNAME_MAX_LENGTH = 20;
const PROFILE_INITIALIZATION_DELAY_MS = 1750;
const PROFILE_DELETION_DELAY_MS = 1500;
const PROFILE_CARD_SURFACE_CLASS =
  "border border-white/10 bg-black/60 backdrop-blur-md";

const avatars = [
  { id: "lucia", name: "Lucia", image: "/images/Jason_and_Lucia_01.jpg" },
  { id: "jason", name: "Jason", image: "/images/Jason_Duval_01.jpg" },
  { id: "brian", name: "Brian", image: "/images/Brian_Heder_01.jpg" },
  { id: "vice-city", name: "Vice City", image: "/images/Jason_and_Lucia_04.jpg" },
  { id: "leonida", name: "Leonida", image: "/images/Jason_Duval_07.jpg" },
] as const;

const consoles = [
  {
    id: "pc",
    label: "PC",
    image: "/images/computer.png",
  },
  {
    id: "ps5",
    label: "PlayStation 5",
    image: "/images/logo%20ps5.png",
  },
  {
    id: "xbox",
    label: "Xbox",
    image: "/images/xbox.png",
  },
] as const satisfies readonly {
  id: string;
  label: string;
  image: string;
}[];

type ConsoleId = (typeof consoles)[number]["id"];
type AvatarId = (typeof avatars)[number]["id"];

interface PlayerProfile {
  readonly username: string;
  readonly console: ConsoleId;
  readonly avatar: AvatarId;
}

function isPlayerProfile(value: unknown): value is PlayerProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const profile = value as Record<string, unknown>;

  return (
    typeof profile.username === "string" &&
    profile.username.trim().length >= 2 &&
    profile.username.trim().length <= USERNAME_MAX_LENGTH &&
    consoles.some((consoleOption) => consoleOption.id === profile.console) &&
    avatars.some((avatarOption) => avatarOption.id === profile.avatar)
  );
}

function getAvatar(avatarId: AvatarId) {
  return avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0];
}

function getConsole(consoleId: ConsoleId) {
  return (
    consoles.find((consoleOption) => consoleOption.id === consoleId) ??
    consoles[0]
  );
}

/**
 * First-visit player setup and the persistent Games-page player badge.
 */
export function GamesPlayerProfile({
  onProfileDeleted,
  onProfileReady,
}: {
  onProfileDeleted: () => void;
  onProfileReady: () => void;
}) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasStartedWelcome, setHasStartedWelcome] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [consoleId, setConsoleId] = useState<ConsoleId>("pc");
  const [avatarId, setAvatarId] = useState<AvatarId>(avatars[0].id);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const deleteTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const avatar = getAvatar(avatarId);
  const selectedConsole = getConsole(consoleId);
  const profileConsole = profile ? getConsole(profile.console) : selectedConsole;

  useEffect(() => {
    let storedProfile: PlayerProfile | null = null;
    let readError = "";

    try {
      const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

      if (savedProfile) {
        const parsed: unknown = JSON.parse(savedProfile);

        if (isPlayerProfile(parsed)) {
          storedProfile = {
            ...parsed,
            username: parsed.username.trim(),
          };
        } else {
          window.localStorage.removeItem(PROFILE_STORAGE_KEY);
        }
      }
    } catch {
      readError =
        "Local profile storage is unavailable. Your profile may not persist on this device.";
    }

    const frameId = window.requestAnimationFrame(() => {
      setProfile(storedProfile);
      if (storedProfile) {
        setUsername(storedProfile.username);
        setConsoleId(storedProfile.console);
        setAvatarId(storedProfile.avatar);
      }
      setStorageError(readError);
      setIsHydrated(true);
      if (storedProfile) {
        onProfileReady();
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
      if (deleteTimerRef.current !== null) {
        window.clearTimeout(deleteTimerRef.current);
      }
    };
  }, [onProfileReady]);

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    const normalizedUsername = username.trim();

    if (normalizedUsername.length < 2) {
      setFormError("Choose a player name with at least 2 characters.");
      return;
    }

    if (normalizedUsername.length > USERNAME_MAX_LENGTH) {
      setFormError(`Player names can be up to ${USERNAME_MAX_LENGTH} characters.`);
      return;
    }

    const nextProfile: PlayerProfile = {
      username: normalizedUsername,
      console: consoleId,
      avatar: avatarId,
    };

    setFormError("");
    setStorageError("");
    setIsSaving(true);
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null;

      try {
        window.localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(nextProfile),
        );
      } catch {
        setStorageError(
          "Could not save your profile in this browser. Check local storage settings and try again.",
        );
        setIsSaving(false);
        return;
      }

      setProfile(nextProfile);
      setUsername(normalizedUsername);
      setIsSaving(false);
      setIsEditing(false);
      onProfileReady();
    }, PROFILE_INITIALIZATION_DELAY_MS);
  };

  const startExperience = () => {
    setHasStartedWelcome(true);
    window.dispatchEvent(new Event(GAMES_WELCOME_START_EVENT));
  };

  const deleteProfile = () => {
    if (isDeleting) {
      return;
    }

    setStorageError("");
    setIsDeleting(true);
    deleteTimerRef.current = window.setTimeout(() => {
      deleteTimerRef.current = null;

      try {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      } catch {
        setStorageError(
          "Could not delete your profile in this browser. Check local storage settings and try again.",
        );
        setIsDeleting(false);
        return;
      }

      setIsDeleting(false);
      setProfilePopoverOpen(false);
      setIsEditing(false);
      setAvatarPickerOpen(false);
      setUsername("");
      setConsoleId("pc");
      setAvatarId(avatars[0].id);
      setFormError("");
      setStorageError("");
      setProfile(null);
      setHasStartedWelcome(false);
      onProfileDeleted();
    }, PROFILE_DELETION_DELAY_MS);
  };

  const startEditing = () => {
    if (profile) {
      setUsername(profile.username);
      setConsoleId(profile.console);
      setAvatarId(profile.avatar);
    }
    setFormError("");
    setProfilePopoverOpen(false);
    setIsEditing(true);
  };

  const dialogOpen =
    isHydrated && (isEditing || (!profile && hasStartedWelcome));

  return (
    <>
      <AnimatePresence>
        {isHydrated && !profile && !hasStartedWelcome && (
          <motion.section
            aria-label="Games welcome"
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            className="fixed inset-0 z-40 isolate flex min-h-svh items-center justify-center overflow-hidden bg-transparent px-5 py-12 text-center"
            exit={{
              opacity: 0,
              scale: 1.01,
              y: -6,
              filter: "blur(8px)",
              transition: {
                duration: shouldReduceMotion ? 0 : 0.48,
                ease: "easeInOut",
              },
            }}
            initial={{
              opacity: 0,
              scale: 0.985,
              y: 8,
              filter: "blur(8px)",
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center"
              initial={{ opacity: 0, y: 22 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.12,
                duration: shouldReduceMotion ? 0 : 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1 className="display-type text-[clamp(3.35rem,11.4vw,8.6rem)] leading-[0.82] tracking-[0.015em] text-white [text-shadow:0_8px_50px_rgba(0,0,0,0.65)]">
                TORQUI
                <span className="text-cyan-200 drop-shadow-[0_0_24px_rgba(103,232,249,0.38)]">
                  RS
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-xs leading-6 text-white/55 sm:mt-6 sm:text-sm sm:leading-7">
                A next-generation gaming hub for cinematic worlds, competitive
                arenas, and unforgettable play.
              </p>
              <Button
                className="group relative mt-7 min-h-12 min-w-56 overflow-hidden px-7 text-[10px] tracking-[0.2em] sm:mt-8"
                onClick={startExperience}
                type="button"
                variant="default"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">INITIALIZE SYSTEM</span>
                <ArrowRight
                  aria-hidden="true"
                  className="relative transition-transform duration-200 group-hover:translate-x-1"
                  size={15}
                />
              </Button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {profile && (
        <Popover
          open={profilePopoverOpen}
          onOpenChange={(open) => {
            if (!isDeleting) {
              setProfilePopoverOpen(open);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              aria-label={`Player profile for ${profile.username}`}
              className="fixed right-5 top-5 z-40 grid size-12 min-h-0 place-items-center rounded-full border border-white/15 bg-transparent p-0 text-white shadow-[0_0_18px_rgba(34,211,238,0.12)] backdrop-blur-none hover:border-neon-cyan/50 hover:bg-transparent hover:shadow-[0_0_22px_rgba(34,211,238,0.22)] sm:right-7 sm:top-7"
              size="icon"
              variant="ghost"
            >
              <Avatar className="size-11 border-neon-cyan/35" size="default">
                <AvatarImage
                  alt={profile.username}
                  src={getAvatar(profile.avatar).image}
                />
                <AvatarFallback>
                  {profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <AnimatePresence>
            {profilePopoverOpen && (
              <PopoverContent
                align="end"
                className={`w-[min(18rem,calc(100vw-2rem))] ${PROFILE_CARD_SURFACE_CLASS} p-0`}
                forceMount
                sideOffset={12}
              >
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 6 }}
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.18,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="size-12 border-neon-cyan/35" size="lg">
                      <AvatarImage
                        alt={profile.username}
                        src={getAvatar(profile.avatar).image}
                      />
                      <AvatarFallback>
                        {profile.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-bold text-white">
                          {profile.username}
                        </p>
                        <Image
                          alt={`${profileConsole.label} logo`}
                          className="size-6 shrink-0 object-contain"
                          height={24}
                          src={profileConsole.image}
                          width={24}
                        />
                      </div>
                    </div>
                    <ShieldCheck
                      aria-label="Profile saved on this device"
                      className="shrink-0 text-neon-cyan/80"
                      size={17}
                    />
                  </div>
                  {storageError && (
                    <p
                      aria-live="polite"
                      className="mx-3 mb-2 rounded-md border border-red-300/15 bg-red-400/[0.06] px-2.5 py-2 text-[10px] leading-4 text-red-100/80"
                      role="alert"
                    >
                      {storageError}
                    </p>
                  )}
                  <div className="border-t border-white/10 p-1.5">
                    <Button
                      className="w-full justify-start text-[10px] tracking-[0.12em]"
                      onClick={startEditing}
                      disabled={isDeleting}
                      size="sm"
                      variant="ghost"
                    >
                      <Pencil aria-hidden="true" size={14} />
                      EDIT PLAYER PROFILE
                    </Button>
                    <Button
                      aria-busy={isDeleting}
                      className={`w-full justify-start text-[10px] tracking-[0.12em] text-red-200/80 transition-[color,background-color,box-shadow] ${
                        isDeleting
                          ? "bg-red-400/[0.08] text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.12)]"
                          : "hover:border-red-300/20 hover:bg-red-400/[0.08] hover:text-red-100"
                      }`}
                      onClick={deleteProfile}
                      disabled={isDeleting}
                      size="sm"
                      variant="ghost"
                    >
                      {isDeleting ? (
                        <LoaderCircle
                          aria-hidden="true"
                          className="animate-spin"
                          size={14}
                        />
                      ) : (
                        <Trash2 aria-hidden="true" size={14} />
                      )}
                      {isDeleting ? "DELETING..." : "DELETE PROFILE"}
                    </Button>
                  </div>
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
      )}

      <Dialog
        onOpenChange={(open) => {
          if (!open && profile && !isSaving) {
            setIsEditing(false);
            setAvatarPickerOpen(false);
          }
        }}
        open={dialogOpen}
      >
        <DialogContent
          className={`top-[calc(50%-2rem)] w-[calc(100%-2rem)] max-w-sm gap-3 ${PROFILE_CARD_SURFACE_CLASS} p-4 text-white shadow-[0_18px_70px_rgba(0,0,0,0.5),0_0_30px_rgba(34,211,238,0.06)] sm:max-w-sm sm:p-5`}
          overlayClassName="bg-black/30 backdrop-blur-[1px]"
          onEscapeKeyDown={(event) => {
            if (!profile || isSaving) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (!profile || isSaving) {
              event.preventDefault();
            }
          }}
          showCloseButton={Boolean(profile) && !isSaving}
        >
          <DialogHeader className="gap-1 pr-8">
            <DialogTitle className="display-type text-2xl tracking-wide text-white sm:text-3xl">
              {isEditing ? "Edit player profile" : "Initialize player"}
            </DialogTitle>
            <DialogDescription className="text-[11px] leading-4">
              Create a player card for your Games profile.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-3" onSubmit={saveProfile}>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65"
                  htmlFor="player-username"
                >
                  Player name
                </label>
                <p className="text-[9px] text-white/35">
                  {username.length}/{USERNAME_MAX_LENGTH}
                </p>
              </div>
              <Input
                autoComplete="nickname"
                autoFocus
                className="h-10 min-h-10 text-xs"
                disabled={isSaving}
                id="player-username"
                maxLength={USERNAME_MAX_LENGTH}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setFormError("");
                }}
                placeholder="Enter your callsign"
                value={username}
              />
            </div>

            <fieldset className="space-y-1.5">
              <legend className="mb-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65">
                Preferred platform
              </legend>
              <div className="grid grid-cols-3 gap-1.5">
                {consoles.map(({ id, label, image }) => {
                  const isSelected = consoleId === id;

                  return (
                    <Button
                      aria-label={label}
                      aria-pressed={isSelected}
                      className={`h-auto min-h-14 flex-col gap-1 px-1.5 py-2 text-[9px] tracking-wide transition-[border-color,background-color,box-shadow,transform] duration-200 ${
                        isSelected
                          ? "scale-[1.03] border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_18px_rgba(149,233,223,0.08)]"
                          : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/25 hover:bg-white/[0.06] hover:text-white/85"
                      }`}
                      key={id}
                      onClick={() => setConsoleId(id)}
                      disabled={isSaving}
                      type="button"
                      variant="outline"
                    >
                      <Image
                        alt=""
                        className="size-9 object-contain"
                        height={36}
                        src={image}
                        width={36}
                      />
                      <span className="sr-only">{label}</span>
                    </Button>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <span className="block text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65">
                Choose an avatar
              </span>
              <Popover
                onOpenChange={setAvatarPickerOpen}
                open={avatarPickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    className="h-auto min-h-11 w-full justify-start gap-2.5 border-white/10 bg-black/20 py-1.5 text-left text-white/80 hover:border-neon-cyan/35 hover:bg-white/[0.04]"
                    disabled={isSaving}
                    variant="outline"
                  >
                    <Avatar className="size-8 border-white/20">
                      <AvatarImage alt={avatar.name} src={avatar.image} />
                      <AvatarFallback>
                        {avatar.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-xs">{avatar.name}</span>
                    <span className="text-[8px] uppercase tracking-[0.14em] text-neon-cyan/70">
                      Change
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[min(21rem,calc(100vw-3rem))] border-white/15 bg-[#10131b]/98 p-3"
                  sideOffset={8}
                >
                  <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    Select player avatar
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {avatars.map((option) => (
                      <Button
                        aria-label={`Choose ${option.name} avatar`}
                        aria-pressed={avatarId === option.id}
                        className={`h-auto flex-col gap-1.5 rounded-lg border p-2 ${
                          avatarId === option.id
                            ? "border-neon-cyan/55 bg-neon-cyan/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:bg-white/[0.06]"
                        }`}
                        key={option.id}
                        onClick={() => {
                          setAvatarId(option.id);
                          setAvatarPickerOpen(false);
                        }}
                        type="button"
                        variant="ghost"
                      >
                        <Avatar className="size-12 border-white/15">
                          <AvatarImage alt="" src={option.image} />
                          <AvatarFallback>
                            {option.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[9px]">{option.name}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {(formError || storageError) && (
              <p
                aria-live="polite"
                className="rounded-lg border border-red-300/15 bg-red-400/[0.06] px-3 py-2 text-xs leading-5 text-red-100/80"
                role="alert"
              >
                {formError || storageError}
              </p>
            )}

            <Button
              aria-busy={isSaving}
              className="group relative min-h-10 w-full overflow-hidden text-[9px] tracking-[0.18em]"
              disabled={isSaving}
              type="submit"
              variant="default"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {isSaving ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="relative animate-spin"
                  size={15}
                />
              ) : (
                <Sparkles aria-hidden="true" className="relative" size={15} />
              )}
              <span className="relative">
                {isSaving
                  ? "INITIALIZING..."
                  : profile
                    ? "ENTER ARENA"
                    : "INITIALIZE PROFILE"}
              </span>
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-[8px] text-white/35">
              <ShieldCheck aria-hidden="true" size={12} />
              Stored on this device only · No account required
            </p>
          </form>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {!isHydrated && (
          <motion.span
            animate={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-30 bg-black/15"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
