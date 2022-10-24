interface ID3 {
    readonly header: ID3Header
    readonly frames: ID3Frame[]
}

interface HeaderFlags {
    readonly unsynchronisation: boolean
    readonly extended: boolean //决定这个标头后面是否还有扩展标头
    readonly experimental: boolean
}

interface FrameFlags {
    readonly tagAlterPreservation: boolean //设为1时，当文件的 ID3v2 标签内容被改变时，如果软件不认识此Frame，则此Frame应该被丢弃
    readonly fileAlterPreservation: boolean //设为1时，当文件的Audio Data被改变时，如果软件不认识此Frame，则此Frame应该被丢弃
    readonly readOnly: boolean //设为1时，则此Frame的Content字段不能被改变
    readonly compression: boolean //设为1时，此Frame的Content字段数据使用zlib进行压缩，且须将解压缩后的数据大小(Decompressed Size)记录在Frame的Content字段之前，为 4 bytes 的数值。解压缩大小以32 bits来计算
    readonly encryption: boolean //设为1时，此Frame的Content字段为加密状态
    readonly groupingIdentity: boolean //设为1时，此Frame跟其他的Frame为同一个群组
}

interface ID3Header {
    readonly id: 'ID3' | null
    readonly version: number
    readonly revision: number
    readonly flags: HeaderFlags
    readonly size: number
}

interface ExtendedHeader {
    readonly paddingSize: number
}

interface ID3Frame {
    readonly id: TagName
    readonly flags: FrameFlags
    readonly content: ArrayBuffer
}

export interface TagReader {
    getTag(): Promise<ID3>
    on(type: 'header', handler: (header: ID3Header) => void): this
    on(type: 'extended', handler: (header: ExtendedHeader) => void): this
    on(type: 'frame', handler: (frame: ID3Frame) => void): this
    on(type: 'end', handler: () => void): this
    on(type: 'error', handler: (err: any) => void): this
    off(type: String, handler: Function): boolean
}

interface TagName extends String {
    readonly length: 4
}

export interface TagWriter {
    getBuffer(): ArrayBuffer
    write(buffer: ArrayBuffer): TagWriter
    put(name: TagName, val: ArrayBuffer): TagWriter
    put(name: TagName, val: String, encoding?: 'utf-8' | 'utf-16' | 'utf-16be' | 'iso-8859-2'): TagWriter
    writeHeader(config: ID3Header): TagWriter
    writePadding(size: number): TagWriter
}
