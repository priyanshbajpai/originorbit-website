import Foundation
import AVFoundation
import AppKit

// swift -sdk /Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk scripts/prepare-clay-hero-v3.swift CLIP_ONE CLIP_TWO TEMP_FRAMES OUTPUT_MEDIA
let sources = [CommandLine.arguments[1], CommandLine.arguments[2]].map { AVURLAsset(url: URL(fileURLWithPath: $0)) }
let frames = URL(fileURLWithPath: CommandLine.arguments[3], isDirectory: true)
let output = URL(fileURLWithPath: CommandLine.arguments[4], isDirectory: true)
try FileManager.default.createDirectory(at: frames, withIntermediateDirectories: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)

let sampleRate = 12
var durations: [Double] = []
var totalFrames = 0
for (clipIndex, asset) in sources.enumerated() {
    let duration = CMTimeGetSeconds(asset.duration)
    let count = Int(round(duration * Double(sampleRate)))
    durations.append(duration)
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.maximumSize = CGSize(width: 2560, height: 1440)
    generator.requestedTimeToleranceBefore = CMTime(seconds: 0.015, preferredTimescale: 600)
    generator.requestedTimeToleranceAfter = CMTime(seconds: 0.015, preferredTimescale: 600)
    for index in 0..<count {
        let second = min(duration - 1.0 / 48.0, Double(index) / Double(sampleRate))
        let image = try generator.copyCGImage(at: CMTime(seconds: second, preferredTimescale: 600), actualTime: nil)
        let bitmap = NSBitmapImageRep(cgImage: image)
        let name = String(format: "%03d.jpg", totalFrames + index)
        try bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.95])!
            .write(to: frames.appendingPathComponent(name))
        if index % 24 == 0 { print("Clip \(clipIndex + 1): \(index)/\(count) frames"); fflush(stdout) }
    }
    totalFrames += count
}

let composition = AVMutableComposition()
let video = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
let hasAudio = sources.contains { !$0.tracks(withMediaType: .audio).isEmpty }
let audio = hasAudio ? composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) : nil
var cursor = CMTime.zero
for asset in sources {
    let range = CMTimeRange(start: .zero, duration: asset.duration)
    let track = asset.tracks(withMediaType: .video)[0]
    try video.insertTimeRange(range, of: track, at: cursor)
    video.preferredTransform = track.preferredTransform
    if let sourceAudio = asset.tracks(withMediaType: .audio).first, let audio {
        try audio.insertTimeRange(range, of: sourceAudio, at: cursor)
    }
    cursor = CMTimeAdd(cursor, asset.duration)
}

for (name, preset) in [("film-desktop.mp4", AVAssetExportPreset1920x1080), ("film-mobile.mp4", AVAssetExportPreset1280x720)] {
    let target = output.appendingPathComponent(name)
    try? FileManager.default.removeItem(at: target)
    guard let exporter = AVAssetExportSession(asset: composition, presetName: preset) else { fatalError("Cannot export \(name)") }
    exporter.outputURL = target
    exporter.outputFileType = .mp4
    exporter.shouldOptimizeForNetworkUse = true
    let done = DispatchSemaphore(value: 0)
    exporter.exportAsynchronously { done.signal() }
    done.wait()
    guard exporter.status == .completed else { fatalError(exporter.error?.localizedDescription ?? "Export failed") }
    print("Exported \(name)"); fflush(stdout)
}

let manifest: [String: Any] = ["duration": durations.reduce(0, +), "clipDurations": durations, "frameCount": totalFrames, "sampleFPS": sampleRate, "sourceWidth": 3840, "sourceHeight": 2160]
try JSONSerialization.data(withJSONObject: manifest, options: [.prettyPrinted, .sortedKeys])
    .write(to: output.appendingPathComponent("manifest.json"))
