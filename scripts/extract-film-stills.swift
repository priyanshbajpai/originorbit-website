import Foundation
import AVFoundation
import AppKit

// swift scripts/extract-film-stills.swift SOURCE OUTPUT_DIRECTORY
let source = URL(fileURLWithPath:CommandLine.arguments[1])
let destination = URL(fileURLWithPath:CommandLine.arguments[2],isDirectory:true)
try FileManager.default.createDirectory(at:destination,withIntermediateDirectories:true)
let asset = AVURLAsset(url:source)
let duration = CMTimeGetSeconds(asset.duration)
let frameCount = Int(ceil(duration * 12))
let generator = AVAssetImageGenerator(asset:asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width:2560,height:1440)
generator.requestedTimeToleranceBefore = CMTime(seconds:0.025,preferredTimescale:600)
generator.requestedTimeToleranceAfter = CMTime(seconds:0.025,preferredTimescale:600)
for index in 0..<frameCount {
  let time = max(0,duration - 1.0/30) * Double(index) / Double(frameCount - 1)
  let image = try generator.copyCGImage(at:CMTime(seconds:time,preferredTimescale:600),actualTime:nil)
  let bitmap = NSBitmapImageRep(cgImage:image)
  try bitmap.representation(using:.jpeg,properties:[.compressionFactor:0.92])!.write(to:destination.appendingPathComponent(String(format:"%03d.jpg",index)))
  if index % 40 == 0 { print("Extracted \(index)/\(frameCount)"); fflush(stdout) }
}
