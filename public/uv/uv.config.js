self.__uv$config = {
    prefix: '/uv/service/',
    bare: 'https://uv.benropro.me', // If iBoss blocks this, try https://t-8-0-2.p-3-1-0.xyz
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
