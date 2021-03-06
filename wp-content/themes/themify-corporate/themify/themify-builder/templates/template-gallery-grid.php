<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * Template Gallery Grid
 * 
 * Access original fields: $mod_settings
 * @author Themify
 */

extract( $settings, EXTR_SKIP );
?>

	<?php
	$i = 0;
	foreach ( $gallery_images as $image ):
	?>
		<dl class="gallery-item">
			<dt class="gallery-icon">
				<?php
				if ( $link_opt == 'file' ) {
					$link = wp_get_attachment_url( $image->ID );
				} elseif ( 'none' == $link_opt ) {
					$link = '';
				} else{
					$link = get_attachment_link( $image->ID );
				}
				$link_before = '' != $link ? sprintf( '<a title="%s" href="%s">', esc_attr( $image->post_title ), esc_url( $link ) ) : '';
				$link_after = '' != $link ? '</a>' : '';
				if( $this->is_img_php_disabled() ) {
					$image = wp_get_attachment_image( $image->ID, $image_size_gallery );
				} else {
					$image = wp_get_attachment_image_src( $image->ID, 'full' );
					$image = themify_get_image( "ignore=true&src={$image[0]}&w={$thumb_w_gallery}&h={$thumb_h_gallery}" );
				}

				echo $link_before . $image . $link_after;
				?>
			</dt>

			<?php if( isset( $image->post_excerpt ) && '' != $image->post_excerpt ) : ?>
			<dd class="wp-caption-text gallery-caption">
				<?php echo $image->post_excerpt; ?>
			</dd>
			<?php endif; ?>

		</dl>

		<?php if ( $columns > 0 && ++$i % $columns == 0 ): ?>
		<br style="clear: both" />
		<?php endif; ?>

	<?php endforeach; // end loop ?>
	<br style="clear: both" />