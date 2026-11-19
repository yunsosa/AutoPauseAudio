# AutoPauseAudio for Vencord

Play a second MP3 or WAV attachment in Discord and the first one pauses. Play the first again to resume from where you left off.

## Install

1. Follow [Vencord’s custom plugin guide](https://docs.vencord.dev/installing/custom-plugins/) to set up a local Vencord checkout.
2. Copy `src/userplugins/autoPauseAudio` from this repository into the same path in that checkout.
3. Build and install Vencord according to the guide. For a local build with Vencord’s updater disabled, use `pnpm build --disable-updater`.
4. Enable **AutoPauseAudio** in **User Settings → Vencord → Plugins** and restart Discord.

## Compatibility

Tested with Discord Desktop 1.0.9268 on Windows 11 and Vencord 1.15.18 ([source revision](https://github.com/Vendicated/Vencord/tree/e75ac9ace41f6212cfaa2d5f3670830be392da4e)). The test used MP3 and WAV fixtures in Discord’s built-in player and verified that playback paused, the controls updated, and playback resumed at the same position.

The plugin only handles MP3 and WAV attachments hosted on Discord’s attachment CDN. Discord updates may change the built-in player and require a plugin update.

## Support

If AutoPauseAudio helps you audition loops, you can [support the project on Ko-fi](https://ko-fi.com/yunyunwer).


## License

[GPL-3.0-or-later](LICENSE). This is a community plugin for Vencord.
