import Foundation
import AVFoundation
import AppKit

// Run on macOS: swift -suppress-warnings scripts/prepare-final-film.swift SOURCE TEMP_FRAMES OUTPUT_MEDIA
let source = URL(fileURLWithPath: CommandLine.arguments[1])
let frames = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
let destination = URL(fileURLWithPath: CommandLine.arguments[3], isDirectory: true)
try FileManager.default.createDirectory(at: frames, withIntermediateDirectories: true)
try FileManager.default.createDirectory(at: destination, withIntermediateDirectories: true)
let asset = AVURLAsset(url:source)
let duration = CMTimeGetSeconds(asset.duration)
let count = Int(ceil(duration * 12))
let generator = AVAssetImageGenerator(asset:asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width:1440, height:810)
generator.requestedTimeToleranceBefore = CMTime(seconds:0.025,preferredTimescale:600)
generator.requestedTimeToleranceAfter = CMTime(seconds:0.025,preferredTimescale:600)
for index in 0..<count {
  let time = max(0, duration - 1.0/30) * Double(index) / Double(count - 1)
  let image = try generator.copyCGImage(at:CMTime(seconds:time,preferredTimescale:600),actualTime:nil)
  let rep = NSBitmapImageRep(cgImage:image)
  try rep.representation(using:.jpeg,properties:[.compressionFactor:0.94])!.write(to:frames.appendingPathComponent(String(format:"%03d.jpg",index)))
  if index % 40 == 0 { print("Prepared \(index)/\(count) frames"); fflush(stdout) }
}
for (name,preset) in [("film-desktop.mp4",AVAssetExportPreset1920x1080),("film-mobile.mp4",AVAssetExportPreset1280x720)] {
  let target=destination.appendingPathComponent(name)
  try? FileManager.default.removeItem(at:target)
  guard let exporter=AVAssetExportSession(asset:asset,presetName:preset) else { fatalError("Export unavailable") }
  exporter.outputURL=target; exporter.outputFileType = .mp4; exporter.shouldOptimizeForNetworkUse=true
  let done=DispatchSemaphore(value:0)
  exporter.exportAsynchronously { done.signal() }; done.wait()
  guard exporter.status == .completed else { fatalError(exporter.error?.localizedDescription ?? "Export failed") }
  print("Exported \(name)"); fflush(stdout)
}
let metadata: [String:Any] = ["duration":duration,"frameCount":count,"sampleFPS":12,"sourceWidth":3840,"sourceHeight":2160]
try JSONSerialization.data(withJSONObject:metadata,options:[.prettyPrinted,.sortedKeys]).write(to:destination.appendingPathComponent("manifest.json"))
