namespace tyro {
  let imageRegex: RegExp = /(jpeg|jpg|gif|png|webp)$/;
  let audioRegex: RegExp = /(wav|mp3|ogg|aac)$/;
  let leadingSlash: RegExp = /^\//;
  let trailingSlash: RegExp = /\/$/;
  let dataMap = new WeakMap();

  let imagePath = '';
  let audioPath = '';
  let dataPath = '';

  interface IImageResources {
    [key: string]: HTMLImageElement
  }

  interface IAudioResources {
    [key: string]: HTMLAudioElement
  }

  interface IDataResources {
    [key: string]: any
  }

  export let imageResources: IImageResources = {};
  export let audioResources: IAudioResources = {};
  export let dataResources: IDataResources = {};

  /**
   * @class Resource
   * @description 资源加载器
   */
  export class Resource {
    static setImageBasePath(path: string) {
      imagePath = path;
    }

    static setAudioBasePath(path: string) {
      audioPath = path;
    }

    static setDataBasePath(path: string) {
      dataPath = path;
    }

    static load(...urls: string[]): Promise<any[]> {
      return Promise.all(
        urls.map(url => {
          let extension = getExtension(url);

          if (extension?.match(imageRegex)) {
            return Resource.loadImage(url);
          }
          if (extension?.match(audioRegex)) {
            return Resource.loadAudio(url);
          }
          return Resource.loadData(url);
        })
      )
    }

    /**
     * 加载图片资源
     * @param {String} url 图片资源路径
     * @returns {Promise<HTMLImageElement>}
     */
    static loadImage(url: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        let resolvedUrl: string, image: HTMLImageElement, fullUrl: string;

        resolvedUrl = joinPath(imagePath, url);
        if (imageResources[resolvedUrl]) return resolve(imageResources[resolvedUrl]);

        image = new Image();

        image.onload = function loadImageOnLoaded() {
          fullUrl = getUrl(resolvedUrl, window.location.href);
          imageResources[getName(url)] = imageResources[resolvedUrl] = imageResources[fullUrl] = (this as HTMLImageElement);
          tyro.emit('resourceLoaded', this, url);
          resolve(this as HTMLImageElement);
        }

        image.onerror = function loadImageOnError() {
          reject('加载图片出错：' + resolvedUrl);
        }

        image.src = resolvedUrl;
      });
    }


    /**
     * 加载音频资源
     * @param {String} url 音频资源地址
     * @returns {Promise<HTMLAudioElement>}
     */
    static loadAudio(url: string): Promise<HTMLAudioElement> {
      return new Promise((resolve, reject) => {
        let audioEl: HTMLAudioElement = new Audio();
        let canPlay = getCanPlay(audioEl);
        let resolvedUrl: string, fullUrl: string;

        let _url: string = [url].reduce((playableSource, source) => {
          if (playableSource) {
            return playableSource;
          } else if (canPlay[getExtension(source) as string]) {
            return source;
          } else {
            return '';
          }
        }, '0')

        if (!_url) {
          return reject('不能播放该资源的音乐格式：' + url)
        }

        resolvedUrl = joinPath(audioPath, _url);
        if (audioResources[resolvedUrl]) return resolve(audioResources[resolvedUrl]);

        audioEl.addEventListener('canplay', function loadAudioOnLoaded() {
          fullUrl = getUrl(resolvedUrl, window.location.href);
          audioResources[getName(url)] = audioResources[resolvedUrl] = audioResources[fullUrl] = this;
          tyro.emit('resourceLoaded', this, url);
          resolve(this);
        });

        audioEl.onerror = function loadAudioOnError() {
          reject('不能加载音频资源：' + resolvedUrl);
        }

        audioEl.src = resolvedUrl;
        audioEl.load();
      })
    }


    /**
     * 加载二进制资源
     * @param {String} url 二进制资源URL
     * @returns {Promise<any>}
     */
    static loadData(url: string): Promise<any> {
      let resolvedUrl: string, fullUrl: string;

      resolvedUrl = joinPath(dataPath, url);
      if (dataResources[resolvedUrl]) return Promise.resolve(dataResources[resolvedUrl]);

      return fetch(resolvedUrl)
        .then(res => {
          if (!res.ok) throw res;
          return res.clone().json().catch(() => res.text());
        })
        .then(res => {
          fullUrl = getUrl(resolvedUrl, window.location.href);
          if (typeof res === 'object') {
            dataMap.set(res, fullUrl);
          }

          dataResources[getName(url)] = dataResources[resolvedUrl] = dataResources[fullUrl] = res;
          tyro.emit('resourceLoaded', res, url);
          return res;
        });
    }
  }


  /////////////////////////
  //  路径相关函数方法
  /////////////////////////
  /**
   * 获取资源的完整路径
   * @param {String} url 资源路径
   * @param {String} base 根路径
   * @returns {String} 完整路径
   */
  function getUrl(url: string, base: string): string {
    return new URL(url, base).href;
  }

  /**
   * 获取拼接后的根路径和资源路径
   * @param {String} base 根路径
   * @param {String} url 资源路径
   * @returns {String} 拼接后的路径
   */
  function joinPath(base: string, url: string): string {
    return [base.replace(trailingSlash, ''), base ? url.replace(leadingSlash, '') : url]
      .filter(s => s)
      .join('/');
  }

  /**
   * 获取资源拓展名
   * @param {String} url 资源路径
   * @returns 
   */
  function getExtension(url: string): string|undefined {
    return url.split('.').pop();
  }

  /**
   * 获取文件名
   * @param {String} url 资源路径
   * @returns {String} 文件名
   */
  function getName(url: string): string {
    let name = url.replace('.' + getExtension(url), '');
    return name.split('/').length === 2 ? name.replace(leadingSlash, '') : name;
  }

  function getCanPlay(audio: HTMLMediaElement): Record<string, any> {
    return {
      wav: audio.canPlayType('audio/wav; codecs="1"'),
      mp3: audio.canPlayType('audio/mpeg;'),
      ogg: audio.canPlayType('audio/ogg; codecs="vorbis"'),
      aac: audio.canPlayType('audio/aac;')
    }
  }
}