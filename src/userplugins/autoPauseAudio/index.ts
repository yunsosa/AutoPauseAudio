/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

type PausePlayer = () => void;

let running = false;
let previous: WeakRef<HTMLAudioElement> | undefined;
let pausePlayers = new WeakMap<HTMLAudioElement, PausePlayer>();

function isLoopAttachment(audio: HTMLAudioElement): boolean {
    if (audio.srcObject) return false;

    // Discord supplies the attachment through a child <source>.
    const src = audio.currentSrc || audio.src || audio.querySelector<HTMLSourceElement>("source[src]")?.src;
    const url = src && URL.parse(src);

    return !!url
        && url.protocol === "https:"
        && (url.host === "cdn.discordapp.com" || url.host === "media.discordapp.net")
        && /^\/(?:ephemeral-)?attachments\/\d+\/\d+\/[^/]+\.(?:mp3|wav)$/i.test(url.pathname);
}

export default definePlugin({
    name: "AutoPauseAudio",
    description: "Pauses the previous MP3 or WAV attachment when you play another in Discord.",
    authors: [{ name: "AutoPauseAudio contributors", id: 0n }],

    patches: [{
        find: "renderAudio(){",
        replacement: {
            match: /renderAudio\(\)\{return.{0,45}\("audio",\{/,
            replace: "$&onPlay:e=>$self.onAttachmentPlay(e.currentTarget,()=>this.setPlay(!1)),"
        }
    }],

    start() {
        running = true;
    },

    stop() {
        running = false;
        previous = undefined;
        pausePlayers = new WeakMap();
    },

    onAttachmentPlay(audio: HTMLAudioElement, pausePlayer: PausePlayer) {
        if (!running || audio.paused || !isLoopAttachment(audio)) return;

        const oldAudio = previous?.deref();
        pausePlayers.set(audio, pausePlayer);
        previous = new WeakRef(audio);

        if (oldAudio && oldAudio !== audio && isLoopAttachment(oldAudio)) {
            // Pause immediately. Update Discord's controls through the same
            // state transition as its Pause button (also cancels a seek resume).
            oldAudio.pause();
            pausePlayers.get(oldAudio)?.();
            pausePlayers.delete(oldAudio);
        }
    }
});
