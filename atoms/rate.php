<?php
/**
 * Displays a rating component
 */

$id = get_the_ID();

// Atom values
$atom = wp_parse_args( $atom, array(
    'author'    => false,
    'count'     => get_post_meta($id, 'components_rating_count', true),
    'id'        => $id,
    'itemprop'  => 'aggregateRating',
    'itemtype'  => 'http://schema.org/AggregateRating',    
    'max'       => 5,
    'min'       => 0,
    'rate'      => true, 
    'reviewed'  => false,
    'type'      => 'Person',
    'unique'    => uniqid(),
    'value'     => get_post_meta($id, 'components_rating', true)
) );

// Rating fractions
$floor      = floor( $atom['value'] );
$fraction   = $atom['value'] - $floor;

$fullStars  = $fraction >= 0.75 ? round( $atom['value'] ) : $floor;
$halfStars  = $fraction < 0.75 && $fraction > 0.25 ? 1 : 0;
$emptyStars = $atom['max'] - $fullStars - $halfStars;

// If we allow users to rate, we need to add a class so our JS can pick it up
$atom['style']  .= $atom['rate'] ? ' atom-rate-do' : ''; ?>

<div class="atom-rate <?php echo $atom['style']; ?>" itemprop="<?php echo $atom['itemprop']; ?>" itemscope="itemscope" itemtype="<?php echo $atom['itemtype']; ?>" <?php echo $atom['inlineStyle']; ?>>
    
    <meta itemprop="ratingValue" content="<?php echo $atom['value']; ?>" />
    <meta itemprop="bestRating" content="<?php echo $atom['max']; ?>" />
    <meta itemprop="worstRating" content="<?php echo $atom['min']; ?>" />

    <?php if( $atom['itemtype'] == 'http://schema.org/AggregateRating' ) { ?>
        <meta itemprop="reviewCount" content="<?php echo $atom['count']; ?>" />
    <?php } ?>
    
    <?php if( $atom['reviewed'] ) { ?>
        <meta itemprop="itemReviewed" content="<?php echo $atom['reviewed']; ?>" />
    <?php } ?>
    
    <?php if( $atom['author'] ) { ?>
        <meta itemprop="author" itemscope="itemscope" itemtype="http://schema.org/<?php echo $atom['type']; ?>" content="<?php echo $atom['author']; ?>" />
    <?php } ?>
    
    <?php if( $atom['rate'] ) { ?>
        <a href="#" data-id="<?php echo $atom['id']; ?>" data-max="<?php echo $atom['max']; ?>" data-min="<?php echo $atom['min']; ?>">
            
            <span class="atom-rate-rate">
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
                <i class="fa fa-star-o"></i>
            </span>
            
    <?php } ?>
            
        <span class="atom-rate-current">
            <?php 
            
                for($i = 1; $i <= $fullStars; $i++) {
                    echo '<i class="fa fa-star"></i>';
                }
            
                if( $halfStars ) {
                    echo '<i class="fa fa-star-half-o"></i>';
                }
            
                for( $i = 1; $i <= $emptyStars; $i++ ) {
                    echo '<i class="fa fa-star-o"></i>';
                }
            
            ?>
        </span>            
    
    <?php if( $atom['rate'] ) { ?>
        </a>
    <?php } ?>

</div>