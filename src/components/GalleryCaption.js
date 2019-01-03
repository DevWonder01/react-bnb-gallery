import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import GalleryTogglePhotoList from './GalleryTogglePhotoList';
import PhotosShape from '../shapes/PhotosShape';
import {
  THUMBNAIL_WIDTH,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_OFFSET
} from '../constants';
import {
  noop,
  calculateThumbnailsContainerDimension,
  calculateThumbnailOffset
} from '../utils/functions';

const thumbnailStyle = {
  width: THUMBNAIL_WIDTH,
  height: THUMBNAIL_HEIGHT,
};

const propTypes = {
  showThumbnails: PropTypes.bool,
  current: PropTypes.number.isRequired,
  photos: PhotosShape,
  onPress: PropTypes.func,
};

const defaultProps = {
  showThumbnails: true,
  current: 0,
  photos: [],
  onPress: noop,
};

class GalleryCaption extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      showThumbnails: this.props.showThumbnails,
      thumbnailsContainerWidth: 0,
      thumbnailsOffset: 0
    };
    this.toggleThumbnails = this.toggleThumbnails.bind(this);
    this.setGalleryFigcaptionRef = this.setGalleryFigcaptionRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.current !== this.props.current) {
      this.setState(prevState => ({
        thumbnailsOffset: calculateThumbnailOffset(this.props.current, prevState.thumbnailsOffset, this.state.thumbnailsContainerWidth, this.props.photos.length)
      }));
    }
  }

  setGalleryFigcaptionRef = (element) => {
    if (element) {
      const width = element.getBoundingClientRect().width;
      this.setState({
        thumbnailsContainerWidth: width,
        thumbnailsOffset: calculateThumbnailOffset(this.props.current, 0, width, this.props.photos.length)
      });
    }
  };

  toggleThumbnails = () => this.setState(prevState => ({
    showThumbnails: !prevState.showThumbnails,
  }));

  getPhotoByIndex = (index) => this.props.photos[index];

  onThumbnailPress = (event) => {
    const index = parseInt(event.currentTarget.dataset.photoIndex, 10);
    if (index >= 0 && index <= this.props.photos.length - 1) {
      this.props.onPress(index);
    }
  }

  _renderThumbnail = (photo, index, onClick) => {
    const className = classnames(
      "thumbnail-button",
      index === this.props.current && "active"
    );

    return (
      <button
        aria-label={photo.caption}
        className={className}
        data-photo-index={index}
        onClick={onClick}
        disabled={false}>
        <img
          alt={photo.caption}
          src={photo.thumbnail || photo.photo}
          className="thumbnail"
          style={thumbnailStyle} />
      </button>
    );
  };

  render = () => {
    const { current, photos } = this.props;

    const className = classnames("gallery-figcaption", !this.state.showThumbnails && "hide");

    const currentPhoto = this.getPhotoByIndex(current);

    const hasMoreThanOnePhoto = photos.length > 1;

    return (
      <figcaption className={className}>
        <div className="gallery-figcaption--content">
          <div className="gallery-figcaption--inner">
            <div className="gallery-figcaption--info">
              <div className="caption-left">
                {currentPhoto.caption && <h3 className="photo-caption">{currentPhoto.caption}</h3>}
                {currentPhoto.subcaption && <p className="photo-subcaption">{currentPhoto.subcaption}</p>}
              </div>
              {hasMoreThanOnePhoto && (
                <div className="caption-right">
                  <GalleryTogglePhotoList
                    isOpened={this.state.showThumbnails}
                    onPress={this.toggleThumbnails} />
                </div>
              )}
            </div>
            {hasMoreThanOnePhoto && (
              <div className="gallery-figcaption--thumbnails" aria-hidden={false} ref={this.setGalleryFigcaptionRef}>
                <div className="caption-thumbnails" style={{width: calculateThumbnailsContainerDimension(photos.length)}}>
                  <ul className="thumbnails-list" style={{ marginLeft: this.state.thumbnailsOffset }}>
                    {photos.map((photo, index) => (
                      <li key={photo.photo}>
                        {this._renderThumbnail(photo, index, this.onThumbnailPress)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </figcaption>
    );
  }
}

GalleryCaption.propTypes = propTypes;
GalleryCaption.defaultProps = defaultProps;

export default GalleryCaption;
