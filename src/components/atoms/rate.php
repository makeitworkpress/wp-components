<?php
/**
 * Displays a rating component
 */

$id = get_the_ID();

// Backward compatibility
$atom       = MakeitWorkPress\WP_Components\Build::convert_camels($atom, ['authorType' => 'author_type']);

// Atom values
$atom = MakeitWorkPress\WP_Components\Build::multi_parse_args( $atom, [
    'attributes'    => [
        'itemprop'  => 'aggregateRating',
        'itemscope' => 'itemscope',
        'itemtype'  => 'http://schema.org/AggregateRating'
    ],
    'author'        => '',
    'author_type'   => 'http://schema.org/Person',
    'count'         => get_post_meta($id, 'components_rating_count', true),
    'id'            => $id,     // The id for the given post
    'max'           => 5,
    'min'           => 0,
    'rate'          => true,    // Allows visitors to rate
    'reviewed'      => '',      // Allows to add the title for the item reviewed
    'schema'        => true,   // If microdata is rendered or not. Also removes schematic attributes
    'value'         => get_post_meta($id, 'components_rating', true) ? get_post_meta($id, 'components_rating', true) : 0
] );

// Rating fractions
$floor      = floor( $atom['value'] );
$fraction   = $atom['value'] - $floor;

$fullStars  = $fraction >= 0.75 ? round( $atom['value'] ) : $floor;
$halfStars  = $fraction < 0.75 && $fraction > 0.25 ? 1 : 0;
$emptyStars = $atom['max'] - $fullStars - $halfStars;

// If we allow users to rate, we need to add a class so our JS can pick it up
$atom['attributes']['class']  .= $atom['rate'] ? ' atom-rate-can' : ''; 

if( ! $atom['schema'] ) {
    unset($atom['attributes']['itemprop']);    
    unset($atom['attributes']['itemscope']);    
    unset($atom['attributes']['itemtype']);    
}

if( $atom['rate'] ) {
    $atom['attributes']['data']['id'] = $id;
    $atom['attributes']['data']['max'] = $atom['max'];
    $atom['attributes']['data']['min'] = $atom['min'];
}

$attributes = MakeitWorkPress\WP_Components\Build::attributes($atom['attributes']); ?>

<div <?php echo $attributes; ?>>
    
    <?php if( $atom['schema'] ) { ?>

        <meta itemprop="ratingValue" content="<?php echo $atom['value']; ?>" />
        <meta itemprop="bestRating" content="<?php echo $atom['max']; ?>" />
        <meta itemprop="worstRating" content="<?php echo $atom['min']; ?>" />

        <?php if( $atom['attributes']['itemtype'] == 'http://schema.org/AggregateRating' ) { ?>
            <meta itemprop="reviewCount" content="<?php echo $atom['count']; ?>" />
        <?php } ?>
        
        <?php if( $atom['reviewed'] ) { ?>
            <meta itemprop="itemReviewed" content="<?php echo $atom['reviewed']; ?>" />
        <?php } ?>
        
        <?php if( $atom['author'] ) { ?>
            <meta itemprop="author" itemscope="itemscope" itemtype="<?php echo $atom['author_type']; ?>" content="<?php echo $atom['author']; ?>" />
        <?php } ?>

    <?php } ?>
            
    <a class="atom-rate-anchor">
        <?php 
        
            for($i = 1; $i <= $fullStars; $i++) {
                echo '<i class="fas fa-star atom-rate-star"></i>';
            }
        
            if( $halfStars ) {
                echo '<i class="fas fa-star-half atom-rate-star"></i>';
            }
        
            for( $i = 1; $i <= $emptyStars; $i++ ) {
                echo '<i class="far fa-star atom-rate-star"></i>';
            }
        
        ?>
    </a>
    <i class="fas fa-circle-notch fa-spin"></i>
</div>